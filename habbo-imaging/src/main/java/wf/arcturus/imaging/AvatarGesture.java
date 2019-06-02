package wf.arcturus.imaging;

import org.restlet.data.Parameter;

public enum AvatarGesture
{
    NORMAL("std", "Normal, nothing neutral."),
    SMILE("sml", "Smile"),
    SAD("sad", "Sad"),
    ANGRY("agr", "Angry"),
    SURPRISED("srp", "Surprised"),
    EYEBLINK("eyb", "Blink Eye"),
    SPEAK("spk", "Talking");

    public final String key;
    public final String description;
    private AvatarGesture(String key, String description)
    {
        this.key = key;
        this.description = description;
    }

    public static AvatarGesture fromParameter(Parameter parameter)
    {
        if (parameter == null)
        {
            return NORMAL;
        }

        for (AvatarGesture gesture : AvatarGesture.values())
        {
            if (gesture.key.equalsIgnoreCase(parameter.getValue()))
            {
                return gesture;
            }
        }

        return NORMAL;
    }
}
