package wf.arcturus.database;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import wf.arcturus.ConfigurationManager;

class DatabasePool
{
    private HikariDataSource database;

    public boolean startStoragePooling(ConfigurationManager config)
    {
        try
        {
            HikariConfig databaseConfiguration = new HikariConfig();
            databaseConfiguration.setMaximumPoolSize(50);
            databaseConfiguration.setMinimumIdle(10);
            databaseConfiguration.setJdbcUrl("jdbc:mysql://" + config.value("db.hostname", "localhost") + ":" + config.value("db.port", "3306") + "/" + config.value("db.database", "habbo"));
            databaseConfiguration.addDataSourceProperty("serverName", config.value("db.hostname", "localhost"));
            databaseConfiguration.addDataSourceProperty("port", config.value("db.port", "3306"));
            databaseConfiguration.addDataSourceProperty("databaseName", config.value("db.database", "habbo"));
            databaseConfiguration.addDataSourceProperty("user", config.value("db.username"));
            databaseConfiguration.addDataSourceProperty("password", config.value("db.password"));
            databaseConfiguration.addDataSourceProperty("dataSource.logger", "com.mysql.jdbc.log.StandardLogger");
            databaseConfiguration.addDataSourceProperty("dataSource.logSlowQueries", "true");
            databaseConfiguration.addDataSourceProperty("dataSource.dumpQueriesOnException", "true");
            databaseConfiguration.addDataSourceProperty("prepStmtCacheSize", "500");
            databaseConfiguration.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
            databaseConfiguration.addDataSourceProperty("cachePrepStmts", "true");
            databaseConfiguration.addDataSourceProperty("useServerPrepStmts", "true");
            databaseConfiguration.addDataSourceProperty("rewriteBatchedStatements", "true");
            databaseConfiguration.addDataSourceProperty("characterEncoding","utf8");
            databaseConfiguration.addDataSourceProperty("useUnicode","true");
            databaseConfiguration.setAutoCommit(true);
            databaseConfiguration.setConnectionTimeout(300000L);
            databaseConfiguration.setValidationTimeout(5000L);
            databaseConfiguration.setLeakDetectionThreshold(20000L);
            databaseConfiguration.setMaxLifetime(1800000L);
            databaseConfiguration.setIdleTimeout(600000L);
            //databaseConfiguration.setDriverClassName("com.mysql.jdbc.jdbc2.optional.MysqlDataSource");
            this.database = new HikariDataSource(databaseConfiguration);
        }
        catch (Exception e)
        {
            return false;
        }
        return true;
    }
    
    public HikariDataSource database()
    {
        return this.database;
    }
}