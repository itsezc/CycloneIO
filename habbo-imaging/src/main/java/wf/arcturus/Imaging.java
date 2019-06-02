package wf.arcturus;

import org.restlet.Component;
import org.restlet.data.Protocol;
import wf.arcturus.database.Database;
import wf.arcturus.imaging.AvatarParts;
import wf.arcturus.imaging.GuildParts;
import wf.arcturus.imaging.imagers.AvatarImager;
import wf.arcturus.routes.AvatarImagerHelpRequest;
import wf.arcturus.routes.AvatarImagerRequest;
import wf.arcturus.routes.FourOhFourRequest;
import wf.arcturus.routes.GuildBadgeRequest;

import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

public class Imaging
{
    public static ConfigurationManager  configurationManager;
    public static Database              database;
    public static GuildParts            guildParts;
    public static AvatarParts           avatarParts;
    public static List<String>          whitelistedDomains;

    public static void main(String[] args) throws Exception
    {
        System.out.println("Habbo Imaging!");

        String[] folders = new String[]{"cache/avatar/", "cache/badge/", "resources/avatar/", "resources/badge/", "resources/xml/assets/", "resources/xml/fx/"};
        for (int i = 0; i < folders.length; i++)
        {
            File folder = new File(folders[i]);
            folder.mkdirs();
        }

        configurationManager = new ConfigurationManager("config_imager.ini");
        database = new Database(configurationManager);
        guildParts = new GuildParts();
        avatarParts = new AvatarParts();

        AvatarImager.defaultBytes =  Files.readAllBytes(new File("cache/avatar/" + AvatarImager.defaultLook + ".png").toPath());

        Component component = new Component();
        component.getServers().add(Protocol.HTTP, configurationManager.value("host"), configurationManager.integer("port"));

        component.setLogService(new org.restlet.service.LogService(false));
        component.getDefaultHost().attachDefault(FourOhFourRequest.class);
        component.getDefaultHost().attach("/habbo-imaging/avatar/", AvatarImagerRequest.class);
        component.getDefaultHost().attach("/habbo-imaging/avatar/info", AvatarImagerHelpRequest.class);
        component.getDefaultHost().attach("/habbo-imaging/badge/{badge}", GuildBadgeRequest.class);

        whitelistedDomains = new ArrayList<>();
        whitelistedDomains.add("localhost");
        whitelistedDomains.add("nextgenhabbo.com");
        whitelistedDomains.add("imaging.nextgenhabbo.com");
        whitelistedDomains.add("dev.nextgenhabbo.com");
        whitelistedDomains.add("speedhotelli.pw");
        Runtime.getRuntime().gc();
        component.start();
    }

    public static boolean validDomain(String domain)
    {
        return whitelistedDomains.contains(domain);
    }
}
