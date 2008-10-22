from javax.servlet.http import HttpServlet
from com.freebase.happy.json import JSON
from org.apache.lucene.search import IndexSearcher
from com.metaweb.reconservice import ReconSearcher
from com.metaweb.reconservice.record import ReconRecord


class recon(HttpServlet):
    def init(self):
        self.searcher = ReconSearcher(IndexSearcher("/Users/colin/dev/reconciliation_v2/index"))
        self.parser = reconquery.QueryParser()

    def service(self, request, response):
        queryString = request.getParameter("q");
        query = self.parser.parse(JSON.decode(queryString))
        results = self.searcher.query(query)

        out = response.getWriter()
        response.setContentType ("text/html")
        out.write(str(results))
        out.close()

class QueryParser:
    def __init__(self):
        self.indexRecord = ReconRecord.IndexRecord.newBuilder()
        self.propValues = ReconRecord.PropertyValues.newBuilder()
        self.propValue = ReconRecord.propertyValue.newBuilder()

    def parse(self, query):
        indexRecord.clear()
        for prop, value in query.iteritems():
            # prop -> list
            if isinstance(value, list):
                raise Exception("Not supported")
            # prop -> value
            else: self.__parsePropValue(prop, value)

    def __parsePropValue(self, prop, query):
        # prop -> string
        if isinstance(query, basestring):
            self.__addPropValue(prop, value=query)
        # prop -> dict
        elif isinstance(query, dict):
            # expanded property:
            if "name" in query:
                self.__addPropValue(prop, value=query["name"], id=query.get("guid"))
            # cvt:
            else: raise Exception("Not supported")

    def __addPropValue(self, prop, value=None, id=None):
        self.propValues.clear()
        self.propValue.clear()
        self.propValues.setProp(prop)
        if value is not None: self.propValue.setValue(value)
        if guid is not None: self.propValue.setId(id)
        self.propValues.addValues(self.propValue.build())
        self.indexRecord.addProp(self.propValues.build())
