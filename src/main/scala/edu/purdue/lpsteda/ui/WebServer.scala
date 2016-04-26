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
package edu.purdue.lpsteda.ui

import java.io.File
import scala.Array.canBuildFrom
import scala.Option.option2Iterable
import scala.collection.mutable.ArrayBuffer
import akka.actor.ActorRef
import akka.actor.ActorSystem
import akka.actor.Props
import akka.actor.actorRef2Scala
import spray.http.ContentType.apply
import spray.http.HttpEntity
import spray.http.HttpResponse
import spray.http.MediaTypes
import spray.httpx.marshalling.ToResponseMarshallable.isMarshallable
import spray.json.DefaultJsonProtocol
import spray.json.JsArray
import spray.json.JsNumber
import spray.json.JsObject
import spray.json.JsString
import spray.routing.Directive.pimpApply
import spray.routing.SimpleRoutingApp
import spray.routing.directives.FieldDefMagnet.apply
import spray.routing.directives.ParamDefMagnet.apply
import edu.purdue.lpsteda.utils.Helper
import java.util.concurrent.Executors
import edu.purdue.lpsteda.utils.TwitterAPIConsumer
import edu.purdue.lpsteda.utils.TwitterUtils
import org.apache.log4j.Logger
import org.apache.log4j.BasicConfigurator
import spray.json.JsonParser
import spray.json.JsBoolean

object Webserver extends App with SimpleRoutingApp {

//  val logger = Logger.getLogger("Webserver")
//  BasicConfigurator.configure();
  
  // Loading configuration
  val conf = Helper.getConfig()
  
  implicit val system = ActorSystem("webserver")
  implicit val ec = system.dispatcher
  implicit val log = system.log
  
  ec.execute(new TwitterAPIConsumer())
  
//  println(TwitterUtils.getATweetSync())

  val host = conf.getString("webserver.hostname")
  val port = conf.getInt("webserver.port")
  
   val getTweet = path("twitterstream") {
    get {
//      var res = ""
//      if (TwitterUtils.geotagged.size() == 0){
//        res = JsObject("valid" -> JsBoolean(false)).toString()
//      }
//      else {
//        res = TwitterUtils.getATweetSync()
//      }
      complete(HttpResponse(entity = HttpEntity(MediaTypes.`application/json`,
       TwitterUtils.getATweetSync())))
    }
  }
  
  
  // starting http server 
  startServer(interface = host, port = port) {
    getFromDirectory("ui/public") ~
    getTweet    
  }
}