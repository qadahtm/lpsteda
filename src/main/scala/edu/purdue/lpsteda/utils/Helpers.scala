/*
   Copyright 2014 - Thamir Qadah

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
          "callType" -> JsString(callType),
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