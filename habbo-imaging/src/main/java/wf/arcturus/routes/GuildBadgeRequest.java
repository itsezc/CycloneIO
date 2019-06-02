package wf.arcturus.routes;

import org.restlet.data.MediaType;
import org.restlet.representation.ByteArrayRepresentation;
import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;
import wf.arcturus.imaging.imagers.GuildBadgeImager;

public class GuildBadgeRequest extends ServerResource
{
    @Get("image/png")
    public void onGet()
    {
        ByteArrayRepresentation bar
                = new ByteArrayRepresentation(new GuildBadgeImager(this.getRequest().getAttributes().get("badge").toString()).output(), MediaType.IMAGE_PNG);
        getResponse().setEntity(bar);
    }
}
