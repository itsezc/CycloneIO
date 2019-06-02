package wf.arcturus.routes;

import org.restlet.data.MediaType;
import org.restlet.representation.Representation;
import org.restlet.representation.StreamRepresentation;
import org.restlet.representation.StringRepresentation;
import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;

public class FourOhFourRequest extends ServerResource
{
    @Get("text/html")
    public void onGet()
    {
        Representation representation = new StringRepresentation("<h1>Habbo Imager</h1><br/>" +
                "Created by The General. <br />" +
                "Contact: <br/>" +
                "<ul><li>Skype: wesley.jabbo</li><li>Discord: TheGeneral#0063</li></ul>" +
                "<br />", MediaType.TEXT_HTML);
        getResponse().setEntity(representation);
    }
}
