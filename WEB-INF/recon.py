from javax.servlet.http import HttpServlet
from com.freebase.happy.json import JSON
import reconquery

class HelloWorld(HttpServlet):
    def service(self, request, response):
        queryString = request.getParameter("q");
        query = reconquery.Query(JSON.decode(queryString))

        

        toClient = response.getWriter()
        response.setContentType ("text/html")
        toClient.println ("<html><head><title>aaaaa</title>" + "<body><h1>asdf</h1></body></html>")
