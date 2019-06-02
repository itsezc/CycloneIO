package wf.arcturus.routes;

import org.restlet.data.MediaType;
import org.restlet.representation.ByteArrayRepresentation;
import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;
import wf.arcturus.Imaging;
import wf.arcturus.imaging.imagers.AvatarImager;
import wf.arcturus.imaging.imagers.GuildBadgeImager;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

public class AvatarImagerRequest extends ServerResource
{
    @Get("image/png")
    public void onGet()
    {
        if (getReferrerRef() == null || Imaging.validDomain(getReferrerRef().getHostDomain()))
        {
            ByteArrayRepresentation bar
                    = new ByteArrayRepresentation(
                    new AvatarImager(this.getQuery()).output(), MediaType.IMAGE_PNG);
            getResponse().setEntity(bar);
        }
        else
        {
            try
            {

                ByteArrayRepresentation bar
                        = new ByteArrayRepresentation(Files.readAllBytes(new File("resources/ngh.png").toPath()));
                getResponse().setEntity(bar);
            }
            catch (Exception e)
            {
                getResponse().redirectPermanent("/");
            }

            try {
                Files.write(Paths.get("log.txt"), ("Hotlink host: " + getReferrerRef().getHostDomain() + "").getBytes(), StandardOpenOption.APPEND);
            }catch (IOException e) {
                //exception handling left as an exercise for the reader
            }
        }
    }
}
