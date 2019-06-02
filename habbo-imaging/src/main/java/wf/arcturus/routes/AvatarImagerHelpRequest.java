package wf.arcturus.routes;

import org.restlet.data.MediaType;
import org.restlet.representation.Representation;
import org.restlet.representation.StringRepresentation;
import org.restlet.resource.Get;
import org.restlet.resource.ServerResource;
import wf.arcturus.imaging.AvatarAction;
import wf.arcturus.imaging.AvatarGesture;

public class AvatarImagerHelpRequest extends ServerResource
{
    @Get("text/html")
    public void onGet()
    {
        StringBuilder stringBuilder = new StringBuilder("<h1>Habbo Imager</h1><hr>" +
                "<h3>Parameters:</h3>" +
                "<ul>" +
                "<li><b>figure</b> : Avatar figure string <i>Required</i></li>" +
                "<li><b>direction</b> : Body direction <i>(0 - 7, default: 2)</i></li>" +
                "<li><b>head_direction</b> : Head direction <i>(0 - 7, default: 2)</i></li>" +
                "<li><b>action</b> : Action to perform. <i>Can be chained eg; action=sit,wav (default: std)</i></li>" +
                "<li><b>gesture</b> : Gesture to perform. <i>(default: std)</i></li>" +
                "<li><b>effect</b> : Effect to visualize. <i>(default: 0)</i></li>" +
                "<li><b>frame</b> : Frame number to visualize. <i>(default: 0)</i></li>" +
                "</ul>" +
                "<h3>Actions:</h3>" +
                "<table border='1'>");
        for (AvatarAction action : AvatarAction.values())
        {
            stringBuilder.append("<tr>");
            stringBuilder.append("<td>");
            stringBuilder.append(action.key);
            stringBuilder.append("</td>");
            stringBuilder.append("<td>");
            stringBuilder.append(action.description);
            stringBuilder.append("</td>");
            stringBuilder.append("</tr>");
        }

        stringBuilder.append("</table><br />");
        stringBuilder.append("<h3>Gestures:</h3>");
        stringBuilder.append("<table border='1'>");
        for (AvatarGesture gesture : AvatarGesture.values())
        {
            stringBuilder.append("<tr>");
            stringBuilder.append("<td>");
            stringBuilder.append(gesture.key);
            stringBuilder.append("</td>");
            stringBuilder.append("<td>");
            stringBuilder.append(gesture.description);
            stringBuilder.append("</td>");
            stringBuilder.append("</tr>");
        }
        stringBuilder.append("</table>");

        Representation representation = new StringRepresentation(stringBuilder.toString(), MediaType.TEXT_HTML);
        getResponse().setEntity(representation);
    }
}
