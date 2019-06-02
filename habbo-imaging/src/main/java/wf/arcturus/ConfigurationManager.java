package wf.arcturus;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class ConfigurationManager
{
    public boolean loaded = false;
    public boolean isLoading = false;
    /**
     * Our configurations stored in this object.
     */
    private final Properties properties;
    
    public ConfigurationManager(String path) throws Exception
    {
        this.properties = new Properties();
        
        this.reload();
    }

    /**
     * Reloads the settings from the config file.
     * @throws Exception
     */
    public void reload() throws Exception
    {
        this.isLoading = true;
        this.properties.clear();

        InputStream input = null;

        try {
            File f = new File("config_imager.ini");
            input = new FileInputStream(f);
            this.properties.load(input);

        } catch (IOException ex) {

            ex.printStackTrace();
            System.out.println("[Configuration Manager][CRITICAL] FAILED TO LOAD CONFIG.INI FILE!");
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        if(loaded)
        {
            this.loadFromDatabase();
        }

        this.isLoading = false;
        System.out.println("[Configuration Manager] Loaded!");
    }

    /**
     * Loads the settings from the database.
     */
    public void loadFromDatabase()
    {
        System.out.println("[Configuration Manager] Loading configuration from database...");

        long millis = System.currentTimeMillis();
        try (Connection connection = Imaging.database.dataSource().getConnection(); Statement statement = connection.createStatement())
        {
            if (statement.execute("SELECT * FROM settings"))
            {
                try (ResultSet set = statement.getResultSet())
                {
                    while (set.next())
                    {
                        this.properties.put(set.getString("key"), set.getString("value"));
                    }
                }
            }
        }
        catch (SQLException e)
        {
            e.printStackTrace();
        }

        System.out.println("[Configuration Manager] Loaded! (" + (System.currentTimeMillis() - millis) + " MS)");
    }

    /**
     * Gets the string value for a specific key.
     * @param key The key to find the value for.
     * @return The string value for the key. Returns an empty string if not found.
     */
    public String value(String key)
    {
        return value(key, "");
    }

    /**
     * Gets the string value for a specific key.
     * @param key The key to find the value for.
     * @param defaultValue The value that will be returned when the key is not found.
     * @return The string value for the key. Returns defaultValue when not found.
     */
    public String value(String key, String defaultValue)
    {
        if (this.isLoading)
            return defaultValue;

        if (!this.properties.containsKey(key)) {
            System.out.println("[CONFIG] Key not found: " + key);
        }
        return this.properties.getProperty(key, defaultValue);
    }

    /**
     * Gets the boolean value for a specific key.
     * @param key The key to find the value for.
     * @return The boolean value for the key. Returns false if not found.
     */
    public boolean bool(String key)
    {
        return bool(key, false);
    }

    /**
     * Gets the boolean value for a specific key.
     * @param key The key to find the value for.
     * @param defaultValue The value that will be returned when the key is not found.
     * @return The boolean value for the key. Returns defaultValue when not found.
     */
    public boolean bool(String key, boolean defaultValue)
    {
        if (this.isLoading)
            return defaultValue;

        try
        {
            return (value(key, "0").equals("1")) || (value(key, "false").equals("true"));
        }
        catch (Exception e)
        {
            System.out.println("Failed to parse key " + key + " with value " + value(key) + " to type boolean.");
        }
        return defaultValue;
    }

    /**
     * Gets the int value for a specific key.
     * @param key The key to find the value for.
     * @return The int value for the key. Returns 0 if not found.
     */
    public int integer(String key)
    {
        return integer(key, 0);
    }

    /**
     * Gets the int value for a specific key.
     * @param key The key to find the value for.
     * @param defaultValue The value that will be returned when the key is not found.
     * @return The int value for the key. Returns defaultValue when not found.
     */
    public int integer(String key, Integer defaultValue)
    {
        if (this.isLoading)
            return defaultValue;

        try
        {
            return Integer.parseInt(value(key, defaultValue.toString()));
        } catch (Exception e)
        {
            System.out.println("Failed to parse key " + key + " with value " + value(key) + " to type integer.");
        }
        return defaultValue;
    }

    /**
     * Gets the double value for a specific key.
     * @param key The key to find the value for.
     * @return The double value for the key. Returns 0 if not found.
     */
    public double getDouble(String key)
    {
        return getDouble(key, 0.0);
    }

    /**
     * Gets the double value for a specific key.
     * @param key The key to find the value for.
     * @param defaultValue The value that will be returned when the key is not found.
     * @return The double value for the key. Returns defaultValue when not found.
     */
    public double getDouble(String key, Double defaultValue)
    {
        if (this.isLoading)
            return defaultValue;

        try
        {
            return Double.parseDouble(value(key, defaultValue.toString()));
        }
        catch (Exception e)
        {
            System.out.println("Failed to parse key " + key + " with value " + value(key) + " to type double.");
        }

        return defaultValue;
    }

    /**
     * Updates the give key.
     * @param key The key to update.
     * @param value The new value.
     */
    public void update(String key, String value)
    {
        this.properties.setProperty(key, value);
    }
}