package wf.arcturus.imaging;

import wf.arcturus.Imaging;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class GuildParts
{
    public static final String OUTPUT_FOLDER = "cache/badge/";
    public static final String PARTS_FOLDER = "resources/badge/";
    
    /**
     * Guildparts. The things you use to create the badge.
     */
    private final HashMap<Type, HashMap<Integer, Part>> guildParts = new HashMap<>();
    
    public HashMap<String, BufferedImage> cachedImages = new HashMap<String, BufferedImage>();

    public GuildParts()
    {
        for (Type t : Type.values())
        {
            this.guildParts.put(t, new HashMap<Integer, Part>());
        }

        try (Connection connection = Imaging.database.dataSource().getConnection();
             Statement statement = connection.createStatement();
             ResultSet set = statement.executeQuery("SELECT * FROM guilds_elements"))
        {
            while (set.next())
            {
                this.guildParts.get(Type.valueOf(set.getString("type").toUpperCase())).put(set.getInt("id"), new Part(set));
            }
        }
        catch (SQLException e)
        {
            e.printStackTrace();
        }

        File file = new File(OUTPUT_FOLDER);
        if (!file.exists())
        {
            System.out.println("[BadgeImager] Output folder: " + OUTPUT_FOLDER + " does not exist. Creating!");
            file.mkdirs();
        }

        try
        {
            for(Map.Entry<Type, HashMap<Integer, Part>> set : this.guildParts.entrySet())
            {
                if(set.getKey() == Type.SYMBOL || set.getKey() == Type.BASE)
                {
                    for (Map.Entry<Integer, Part> map : set.getValue().entrySet())
                    {
                        if (!map.getValue().valueA.isEmpty())
                        {
                            try
                            {
                                this.cachedImages.put(map.getValue().valueA, ImageIO.read(new File(PARTS_FOLDER, "badgepart_" + map.getValue().valueA.replace(".gif", ".png"))));
                            }
                            catch (Exception e)
                            {
                                System.out.println("[Badge Imager] Missing Badge Part: " + PARTS_FOLDER + "/badgepart_" + map.getValue().valueA.replace(".gif", ".png"));
                            }
                        }

                        if (!map.getValue().valueB.isEmpty())
                        {
                            try
                            {
                                this.cachedImages.put(map.getValue().valueB, ImageIO.read(new File(PARTS_FOLDER, "badgepart_" + map.getValue().valueB.replace(".gif", ".png"))));
                            }
                            catch (Exception e)
                            {
                                System.out.println("[Badge Imager] Missing Badge Part: " + PARTS_FOLDER + "/badgepart_" + map.getValue().valueB.replace(".gif", ".png"));
                            }
                        }
                    }
                }
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }
    public static class Part
    {
        /**
         * Identifier.
         */
        public final int id;

        /**
         * Part A
         */
        public final String valueA;

        /**
         * Part B
         */
        public final String valueB;

        public Part(ResultSet set) throws SQLException
        {
            this.id = set.getInt("id");
            this.valueA = set.getString("firstvalue");
            this.valueB = set.getString("secondvalue");
        }
    }

    public static enum Type
    {
        /**
         * Badge base.
         */
        BASE,

        /**
         * Symbol
         */
        SYMBOL,

        /**
         * Colors
         */
        BASE_COLOR,
        SYMBOL_COLOR,
        BACKGROUND_COLOR
    }

    public boolean symbolColor(int colorId)
    {
        for(Part part : this.getSymbolColors())
        {
            if(part.id == colorId)
                return true;
        }

        return false;
    }

    public boolean backgroundColor(int colorId)
    {
        for(Part part : this.getBackgroundColors())
        {
            if(part.id == colorId)
                return true;
        }
        return false;
    }

    public HashMap<Type, HashMap<Integer, Part>> getParts()
    {
        return this.guildParts;
    }

    public Collection<Part> getBases()
    {
        return this.guildParts.get(Type.BASE).values();
    }

    public Part getBase(int id)
    {
        return this.guildParts.get(Type.BASE).get(id);
    }

    public Collection<Part> getSymbols()
    {
        return this.guildParts.get(Type.SYMBOL).values();
    }

    public Part getSymbol(int id)
    {
        return this.guildParts.get(Type.SYMBOL).get(id);
    }

    public Collection<Part> getBaseColors()
    {
        return this.guildParts.get(Type.BASE_COLOR).values();
    }

    public Part getBaseColor(int id)
    {
        return this.guildParts.get(Type.BASE_COLOR).get(id);
    }

    public Collection<Part> getSymbolColors()
    {
        return this.guildParts.get(Type.SYMBOL_COLOR).values();
    }

    public Part getSymbolColor(int id)
    {
        return this.guildParts.get(Type.SYMBOL_COLOR).get(id);
    }

    public Collection<Part> getBackgroundColors()
    {
        return  this.guildParts.get(Type.BACKGROUND_COLOR).values();
    }

    public Part getBackgroundColor(int id)
    {
        return this.guildParts.get(Type.BACKGROUND_COLOR).get(id);
    }

    public Part getPart(Type type, int id)
    {
        return this.guildParts.get(type).get(id);
    }

}
