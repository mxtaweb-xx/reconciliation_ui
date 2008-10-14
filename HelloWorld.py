from javax.servlet.http import HttpServlet

class HelloWorld(HttpServlet):
    def doGet(self,request,response):
        self.doPost (request,response)

    def doPost(self,request,response):
        toClient = response.getWriter()
        response.setContentType ("text/html")
        toClient.println ("<html><head><title>aaaaa</title>" + "<body><h1>asdf</h1></body></html>")
