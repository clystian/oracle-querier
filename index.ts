 /*
  *	the oracle_node_net.dll and System.Data.OracleClient.dll libraries are required
  */
 /* Edge.js for use c# code in nodejs  System.Data.Oracleclient */
 var edge = require("edge");
 var db = {};
 db.executeQuery = function(params, callback) {
     console.log(params);
     console.log("Function not loaded");
     if (callback && typeof(callback) == "function") callback(params);
 };
 db.executeQueryObjects = function(params, callback) {
     db.executeQuery(params, function(error, result) {
     if(error)
     	console.log(error);
     else{
     	 var resultObjects = db.toObjects(result);
         if (callback && typeof(callback) == "function") callback(error, resultObjects);
     }  
         
     });
 }
 /* @results array of rows normally sent by oracle statement execution 
 	return @resultsObjects array of objects with row fields as object's properties */
 db.toObjects = function(result) {
     var resultObjects = [];
     var headers = [];
     if (result.length > 1) {
         headers = result[0];
         for (var i = 1; i < result.length; i++) {
             var tmp_obj = {};
             for (var j = 0; j < headers.length; j++) {
                 tmp_obj[headers[j]] = result[i][j];
             }
             resultObjects.push(tmp_obj);
         }
     }
     return resultObjects;
 }
 /* load oracle-query function from dll */
 db.executeQuery = edge.func(require('path').join(__dirname, 'libs/oracle_node_net.dll'));
 db.test = test;
 db.prototype = null;
 module.exports = db;

 function test() {
     var query = "SELECT e.SERIAL_NBR AS SERIAL, es.VENDOR_NAME AS MARCA,  es.VENDOR_MODEL_NUMBER AS MODELO, d.WIFI FROM equip_ca_value ecav, equipment e, equipment_spec es, mss_int.reuso_eqcpe_detalle d WHERE ecav.EQUIPMENT_ID = e.EQUIPMENT_ID AND e.EQUIPMENT_SPEC_ID = es.EQUIPMENT_SPEC_ID AND es.VENDOR_NAME = d.MARCA AND es.VENDOR_MODEL_NUMBER = d.MODELO AND es.EQUIPSPEC_TYPE = 'ATA' AND ecav.CA_VALUE_LABEL = 'Estado CPE' AND ecav.CA_VALUE = 'LIBRE' AND ROWNUM <= 3";
     var query2 = "SELECT e.SERIAL_NBR AS SERIAL, es.VENDOR_NAME AS MARCA, es.VENDOR_MODEL_NUMBER AS MODELO, LISTAGG(CONCAT(CONCAT(ecav.CA_VALUE_LABEL,': '),ecav.CA_VALUE), ', ') WITHIN GROUP (ORDER BY ecav.CA_VALUE_LABEL) ATRIBUTOS FROM equip_ca_value ecav, equipment e, equipment_spec es, mss_int.reuso_eqcpe_detalle d WHERE ecav.EQUIPMENT_ID = e.EQUIPMENT_ID AND e.EQUIPMENT_SPEC_ID = es.EQUIPMENT_SPEC_ID AND es.VENDOR_NAME = d.MARCA AND es.VENDOR_MODEL_NUMBER = d.MODELO AND es.EQUIPSPEC_TYPE = 'MTA' AND (ecav.CA_VALUE_LABEL like  '%MAC%'  OR  (ecav.CA_VALUE_LABEL =  'Estado  CPE'  AND ecav.CA_VALUE = 'LIBRE')) AND ROWNUM <= 5 GROUP BY e.SERIAL_NBR, es.VENDOR_NAME, es.VENDOR_MODEL_NUMBER";
     var connectionString = 'SERVER=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=10.100.77.80)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=PREMSSDB)));uid = CHERNL; pwd = SQAMSSDB;';
     /*var ExecuteQuery = edge.func('oracle_node_net.dll');
     ExecuteQuery({
         connectionString: 'SERVER=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=10.100.77.80)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=PREMSSDB)));uid = CHERNL; pwd = SQAMSSDB;',
         command: query2
     }, function(error, result) {
         if (error) throw error;
         console.log(result);
     });*/
     for (var i = 0; i < 5; i++) db.executeQueryObjects({
         connectionString: connectionString,
         command: query2
     }, function(error, result) {
         if (error) throw error;
         console.log(result);
     });
 }
 //db.test();