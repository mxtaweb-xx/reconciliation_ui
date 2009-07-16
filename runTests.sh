ps -ax | grep "JsTestDriver.jar * --port" > /dev/null
if [[ $? != 0 ]]; then
  echo "Starting server"
  ./testServer.sh
fi
java -jar JsTestDriver.jar --tests all --verbose