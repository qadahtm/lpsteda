

/**
 * @author qadahtm
 */
import collection.mutable.Stack
import org.scalatest._
import edu.purdue.lpsteda.utils.DataUtils

class TestAndPlay extends FlatSpec with Matchers {
  
    "This" should "run and be successful" in {
      val res = true
      
      DataUtils.converToJsonTuple911("ui/public/data/seattle911.csv", "testout.json")
      DataUtils.converToJsonTuple911ir("ui/public/data/seattle911ir3.csv", "testout2.json")
      
      
      res should be (true)
    }
  
//  "A Stack" should "pop values in last-in-first-out order" in {
//    val stack = new Stack[Int]
//    stack.push(1)
//    stack.push(2)
//    stack.pop() should be (2)
//    stack.pop() should be (1)
//  }
//
//  it should "throw NoSuchElementException if an empty stack is popped" in {
//    val emptyStack = new Stack[Int]
//    a [NoSuchElementException] should be thrownBy {
//      emptyStack.pop()
//    } 
//  }
}