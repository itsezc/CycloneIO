package wf.arcturus.database;

import com.zaxxer.hikari.HikariDataSource;
import wf.arcturus.ConfigurationManager;

import java.sql.PreparedStatement;
import java.sql.Statement;

public class Database
{
    private HikariDataSource dataSource;
    private DatabasePool databasePool;
    private ConfigurationManager config;
    
    public Database(ConfigurationManager config)
    {
        this.config = config;

        long millis = System.currentTimeMillis();

        boolean SQLException = false;

        try
        {
            this.databasePool = new DatabasePool();
            if (!this.databasePool.startStoragePooling(config))
            {
                System.out.println("Failed to connect to the database. Shutting down...");
                SQLException = true;
                return;
            }
            this.dataSource = this.databasePool.database();
        }
        catch (Exception e)
        {
            e.printStackTrace();
            SQLException = true;
        }
        finally
        {
            if(SQLException)
            {
                System.exit(-1);
            }
        }

        System.out.println("[Database] Connected! (" + (System.currentTimeMillis() - millis) + " MS)");
    }

    @Deprecated
    public PreparedStatement prepare(String query)
    {
        PreparedStatement statement = null;

        try
        {
            statement = this.dataSource.getConnection().prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        return statement;
    }

    public void dispose()
    {
        if (this.databasePool != null)
        {
            this.databasePool.database().close();
        }
    }

    public HikariDataSource dataSource()
    {
        return this.dataSource;
    }

    public DatabasePool databasePool()
    {
        return this.databasePool;
    }
}

