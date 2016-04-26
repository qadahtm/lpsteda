/*
   Copyright 2016 - Thamir Qadah

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */
package edu.purdue.lpsteda.utils

import scala.collection.mutable.ArrayBuffer
import org.joda.time.format.DateTimeFormat
import org.joda.time.DateTime
import java.io.File
import com.typesafe.config.ConfigFactory
import com.typesafe.config.Config
import scala.concurrent.Await
import scala.concurrent.duration._
import spray.json.JsValue
import spray.json.JsObject
import spray.json.JsString
import spray.http.HttpData
import spray.json.JsNumber
import spray.json.DefaultJsonProtocol
import spray.json.RootJsonFormat
import spray.json.DeserializationException
import scala.io.Source
import java.io.PrintWriter
import scala.collection.mutable.ListBuffer
import spray.json.JsArray
import java.util.concurrent.LinkedBlockingQueue
import com.twitter.hbc.core._
import com.twitter.hbc.core.endpoint.StatusesFilterEndpoint
import com.twitter.hbc.core.endpoint.Location
import com.twitter.hbc.core.endpoint.Location.Coordinate
import com.twitter.hbc.httpclient.auth.OAuth1
import com.twitter.hbc.ClientBuilder
import com.twitter.hbc.core.processor.StringDelimitedProcessor
import com.twitter.hbc.httpclient.auth.Authentication
import com.twitter.hbc.httpclient.auth.OAuth1
import java.util.ArrayList
import spray.json.JsonParser
import spray.json.JsNull
import spray.json.JsBoolean

object Helper {

  val conffile = new File("application.conf")
  val conf = ConfigFactory.parseFile(conffile)

  def getConfig() = {
    conf
  }

  def getActorSystemConfig(host: String, port: String): Config = {

    val akkaThreads = 4
    val akkaBatchSize = 15
    val akkaTimeout = 100
    val akkaHeartBeatPauses = 600
    val akkaFailureDetector = 300.0
    val akkaHeartBeatInterval = 1000

    ConfigFactory.parseString(
      s"""
      |akka.daemonic = on
      |akka.remote.enabled-transports = ["akka.remote.netty.tcp"]
      |akka.remote.transport-failure-detector.heartbeat-interval = $akkaHeartBeatInterval s
      |akka.remote.transport-failure-detector.acceptable-heartbeat-pause = $akkaHeartBeatPauses s
      |akka.remote.transport-failure-detector.threshold = $akkaFailureDetector
      |akka.actor.provider = "akka.remote.RemoteActorRefProvider"
      |akka.remote.netty.tcp.transport-class = "akka.remote.transport.netty.NettyTransport"
      |akka.remote.netty.tcp.hostname = "$host"
      |akka.remote.netty.tcp.port = $port
      |akka.remote.netty.tcp.tcp-nodelay = on
      |akka.remote.netty.tcp.connection-timeout = $akkaTimeout s
      |akka.remote.netty.tcp.execution-pool-size = $akkaThreads
      |akka.actor.default-dispatcher.throughput = $akkaBatchSize
      """.stripMargin)

  }

}


class TwitterAPIConsumer() extends Runnable {
  val conffile = new File("twitter.conf")
  val conf = ConfigFactory.parseFile(conffile)
  
  def run() {
//    println("consumerKey:"+conf.getString("twitter.api.consumerKey"))
//    println("consumerSecret:"+conf.getString("twitter.api.consumerSecret"))
//    println("token:"+conf.getString("twitter.api.token"))
//    println("secret:"+conf.getString("twitter.api.secret"))
    TwitterUtils.consume(conf.getString("twitter.api.consumerKey"),
                        conf.getString("twitter.api.consumerSecret"), 
                        conf.getString("twitter.api.token"), 
                        conf.getString("twitter.api.secret"))
                        
    println("Consuming done!!!!")
    
  }
}

object TwitterUtils {
 
  val bqueue = new LinkedBlockingQueue[String](10000)
  val geotagged = new LinkedBlockingQueue[String](10000)
  
  def getATweetSync() = geotagged.take()
  
  def getATweetAsync() = geotagged.poll()
  
  def consume(consumerKey:String, consumerSecret:String, token:String, secret:String) : Unit = {
    
    val endpoint = new StatusesFilterEndpoint()
    // New York -74,40,-73,41
    // USA: w:-125.51, n: 49.44, e:-66.45. s:23.81
    
    val ny_sw = new Coordinate(-74D,40D)
    val ny_ne = new Coordinate(-73D,41D)
    val ny_loc = new Location(ny_sw,ny_ne)
    
    val usa_sw = new Coordinate(-125.51D,23.81D)
    val usa_ne = new Coordinate(-66.45D,49.44D)
    val usa_loc = new Location(usa_sw,usa_ne)
    
    val locs = new ArrayList[Location]();
    
    locs.add(usa_loc)
    endpoint.locations(locs)
    
//    val terms = new ArrayList[String]();
    
//    terms.add("Purdue");
//    endpoint.trackTerms(terms)
    
    val auth:Authentication = new OAuth1(consumerKey, consumerSecret, token, secret);
    val client  = new ClientBuilder()
            .hosts(Constants.STREAM_HOST)
            .endpoint(endpoint)
            .authentication(auth)
            .processor(new StringDelimitedProcessor(bqueue))
            .build();

    // Establish a connection
    println("Connecting to twitter ...")
    client.connect();
    println("Connected.")
    
    
    val bufferMax = 4000
    val bufferSize = 1000
    while (true){
      var tdc = 0
      var discard = false;
      
      var i = 0
      var ctweet = bqueue.poll()
      while (ctweet != null && i < bufferSize){
        val tjo = JsonParser(ctweet).asJsObject
        val coos = tjo.fields.get("coordinates")
        coos match {
          case Some(t) => {
            val jsnull = JsNull
//            println(jsnull.getClass.getName)
//            println(t.getClass.getName)
            if (!t.getClass().getName().equalsIgnoreCase((jsnull.getClass().getName()))){
//              println(ctweet)
             
              val createdAt = tjo.fields.get("created_at").get.asInstanceOf[JsString]
              val idstr = tjo.fields.get("id_str").get.asInstanceOf[JsString]
              val text =  tjo.fields.get("text").get.asInstanceOf[JsString]
//              println(t)
              val carr = t.asJsObject.fields.get("coordinates").get.asInstanceOf[JsArray]
              val lng = carr.elements(0)
              val lat = carr.elements(1)
              val res = JsObject("created_at" -> createdAt,
                  "idstr" -> idstr,
                  "text" -> text,
                  "lat" -> lat,
                  "lng" -> lng,
                  "valid" -> JsBoolean(true)
                        )
              geotagged.add(res.toString())
            }
          }
          case _ => {}
        }
        
        i = i + 1
        ctweet = bqueue.poll()
        
      }
    
      // discard tweets if buffer max is reached
      while (bqueue.size() > bufferMax){
        bqueue.take()
        tdc = tdc + 1
        discard = true
      }
      if (discard) {
        println(s"discarded ${tdc} tweets from bqueue")
        tdc = 0
        discard = false;
      }
      
      while (geotagged.size() > bufferMax){
        geotagged.take()
        tdc = tdc + 1
        discard = true
      }
      if (discard) {
        println(s"discarded ${tdc} tweets from geotagged")
        tdc = 0
        discard = false;
      }
      
//      println("Sleeping for 100 msecs")
      Thread.sleep(100) // sleep for 10 secs
//      println(s"current bqueue buff size = ${bqueue.size()}")
//      println(s"current geo buff size = ${geotagged.size()}")
    }
    
  }
  
}

object DataUtils {
  def converToJsonTuple911(_in_fname: String, _out_fname: String) = {
    val in = Source.fromFile(_in_fname)
    val out = new PrintWriter(new File(_out_fname))

    //    3236 Sw Avalon Way,Aid Response,04/19/2016 04:23:00 AM +0000,47.564398,-122.372799,"(47.564398, -122.372799)",F160043733

    val res = ListBuffer[JsObject]()

    for (line <- in.getLines()) {
      val sline = line.split(",")
      val address = sline(0)
      val callType = sline(1)
      val datetime = sline(2)
      val lat = sline(3)
      val lng = sline(4)
      val rlat = sline(5).substring(2, sline(5).size)
      val rlng = sline(6).substring(0, sline(6).size - 2)
      val inumber = sline(7)

//      println(s"address: ${address}")
//      println(s"callType: ${callType}")
//      println(s"datetime: ${datetime}")
//      println(s"lat: ${lat}")
//      println(s"lng: ${lng}")
//      println(s"rlat: ${rlat}")
//      println(s"rlng: ${rlng}")
//      println(s"inumber: ${inumber}")
      
      
      try {
        val jsmap = Map("address" -> JsString(address),
          "text" -> JsString(callType),
          "datatime" -> JsString(datetime),
          "lat" -> JsNumber(lat.toFloat),
          "lng" -> JsNumber(lng.toFloat),
          "rlat" -> JsNumber(rlat.toFloat),
          "rlng" -> JsNumber(rlng.toFloat),
          "inumber" -> JsString(inumber))
        res += JsObject(jsmap)

      } catch {
        case t: Throwable => {
          // do nothing
//          t.printStackTrace()
        } // TODO: handle error
      }

    }
    
    val fres = JsArray(res.toVector).toString()
    out.println(fres)
    out.close()
    
    println(s"generated ${res.size} tuples")
  }
  
  def converToJsonTuple911ir(_in_fname: String, _out_fname: String) = {
    val in = Source.fromFile(_in_fname)
    val out = new PrintWriter(new File(_out_fname))

    //    15736,FIGHT DISTURBANCE,7/17/2010 20:49,3XX BLOCK OF PINE ST,-122.3381467,47.61097516,"(47.610975163, -122.338146748)"

    val res = ListBuffer[JsObject]()

    for (line <- in.getLines()) {
      val sline = line.split(",")
      val inumber = sline(0)
      val text = sline(1)
      val datetime = sline(2)
      val address = sline(3)
      val lat = sline(5)
      val lng = sline(4)
      val rlat = sline(6).substring(2, sline(6).size)
      val rlng = sline(7).substring(0, sline(7).size - 2)
      
//      println(s"address: ${address}")
//      println(s"callType: ${callType}")
//      println(s"datetime: ${datetime}")
//      println(s"lat: ${lat}")
//      println(s"lng: ${lng}")
//      println(s"rlat: ${rlat}")
//      println(s"rlng: ${rlng}")
//      println(s"inumber: ${inumber}")
      
      
      try {
        val jsmap = Map("address" -> JsString(address),
          "text" -> JsString(text),
          "datatime" -> JsString(datetime),
          "lat" -> JsNumber(lat.toFloat),
          "lng" -> JsNumber(lng.toFloat),
          "rlat" -> JsNumber(rlat.toFloat),
          "rlng" -> JsNumber(rlng.toFloat),
          "inumber" -> JsString(inumber))
        res += JsObject(jsmap)

      } catch {
        case t: Throwable => {
          // do nothing
//          t.printStackTrace()
        } // TODO: handle error
      }

    }
    
    val fres = JsArray(res.toVector).toString()
    out.println(fres)
    out.close()
    
    println(s"generated ${res.size} tuples")
  }
}