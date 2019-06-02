package wf.arcturus.imaging;

import org.restlet.data.Parameter;

import java.awt.*;

public enum AvatarSize
{
    SMALL("s", "sh", 1.0, new Point(33, 56)),
    NORMAL("m", "h", 1.0, new Point(64, 110)),
    LARGE("l", "h", 2.0, new Point(64, 110)),
    XLARGE("xl", "h", 3.0, new Point(64, 110));

    public final String key;
    public final String prefix;
    public final double resize;
    public final Point size;

    private AvatarSize(String key, String prefix, double resize, Point size)
    {
        this.key = key;
        this.prefix = prefix;
        this.resize = resize;
        this.size = size;
    }

    public static AvatarSize fromParameter(Parameter parameter)
    {
        if (parameter == null)
        {
            return NORMAL;
        }

        for (AvatarSize size : AvatarSize.values())
        {
            if (size.key.equalsIgnoreCase(parameter.getValue()))
            {
                return size;
            }
        }

        return NORMAL;
    }
}