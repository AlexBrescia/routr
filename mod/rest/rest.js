/**
 * @author Pedro Sanders
 * @since v1
 */
function RestService(server, locationService, gateways, dids, domains, agents, peers, config) {
    const Spark = Packages.spark.Spark
    const LogManager = Packages.org.apache.logging.log4j.LogManager
    const BasicAuthenticationFilter = Packages.com.qmetric.spark.authentication.BasicAuthenticationFilter
    const AuthenticationDetails = Packages.com.qmetric.spark.authentication.AuthenticationDetails
    const LOG = LogManager.getLogger()
    const credentials = config.rest

    Spark.port(config.rest.port)
    Spark.before(new BasicAuthenticationFilter('/*', new AuthenticationDetails(credentials.username, credentials.password)))

    const get = Spark.get
    const post = Spark.post
    // Is this a bug? For some reason I can not reach the object Spark from within the function stop
    const rStop = Spark.stop

    this.stop = () => {
        LOG.info('Stopping Restful service')
        rStop()
    }

    this.start = () => {
        LOG.info('Starting Restful service on port ' + config.rest.port)
        java.lang.Thread.currentThread().join()
    }

    get('/registry', (request, response) => locationService.listAllAsJSON())
    get('/gateways', (request, response) => JSON.stringify(gateways))
    get('/peers', (request, response) => JSON.stringify(peers))
    get('/agents', (request, response) =>JSON.stringify(agents))
    get('/domains', (request, response) => JSON.stringify(domains))
    get('/dids', (request, response) => JSON.stringify(dids))
    post('/stop', (request, response) => {
        server.stop()
        return 'Done.'
    })
}