package wf.arcturus.imaging.imagers;

import javafx.util.Pair;
import org.restlet.data.Form;
import org.restlet.data.Parameter;
import wf.arcturus.Imaging;
import wf.arcturus.imaging.*;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;
import java.util.*;
import java.util.List;

public class AvatarImager extends Imager
{
    public static String defaultLook = "lg-275-78.ch-3110-65-62.fa-1211-62.hr-110-42.ca-1807-64.hd-3093-1";
    public static byte[] defaultBytes = new byte[0];
    private String avatar         = defaultLook;
    private AvatarSize size       = AvatarSize.NORMAL;
    private int direction         = 2;
    private int headDirection     = 2;
    private boolean bodyMirrored = false;
    private boolean headMirrored = false;
    private boolean headOnly = false;
    private List<AvatarAction> actions   = new ArrayList<>();
    private AvatarGesture gesture = AvatarGesture.NORMAL;
    private int carryItem = 0;
    private int frame = 0;
    private AvatarParts.FX effect = null;

    public AvatarImager(Form parameters)
    {
        super(parameters);

        if (this.validAvatar(parameters.getFirstValue("figure")))
        {
            this.avatar = parameters.getFirstValue("figure");
        }

        this.size = AvatarSize.fromParameter(parameters.getFirst("size"));
        this.direction = directionFromParameter(parameters.getFirst("direction"), 2) % 8;
        this.headDirection = directionFromParameter(parameters.getFirst("head_direction"), this.direction) % 8;
        this.headOnly = booleanFromParameter(parameters.getFirst("headonly"));

        if ((this.direction >= 4 && this.direction <= 6) && this.direction == this.headDirection)
        {
            this.direction = 6 - this.direction;
            this.headDirection = this.direction;
            this.bodyMirrored = true;
            this.headMirrored = true;
        }

        if ((this.headOnly || this.headDirection >= 4 && this.headDirection <= 6))
        {
            this.headDirection = 6 - this.headDirection;
            this.headMirrored = true;
            this.direction = this.headDirection;
        }

        for (String actionKey : parameters.getValuesArray("action", "std"))
        {
            String[] data = actionKey.split("=");
            //System.out.println(actionKey);
            AvatarAction action = AvatarAction.fromString(data[0]);

            if (action != null && !this.actions.contains(action))
            {
                for (AvatarAction illegalWith : action.illegalWith)
                {
                    if (this.actions.contains(illegalWith))
                    {
                        continue;
                    }
                }

                if (action == AvatarAction.CARRY)
                {
                    if (data.length >= 2)
                    {
                        try
                        {
                            this.carryItem = Integer.valueOf(data[1]);
                        }
                        catch (Exception e)
                        {

                        }
                    }
                }

                actions.add(action);
            }
        }

        if (this.actions.isEmpty())
        {
            this.actions.add(AvatarAction.STAND);
        }

        this.gesture = AvatarGesture.fromParameter(parameters.getFirst("gesture"));
        this.frame = Integer.valueOf(parameters.getFirstValue("frame", "0"));
        this.effect = Imaging.avatarParts.effectMap.get(Integer.valueOf(parameters.getFirstValue("effect", "0")));
    }

    @Override
    public byte[] output()
    {
        boolean success = true;
        try
        {

            return this.generate();
        }
        catch (Exception e)
        {
            success = false;
            e.printStackTrace();
        }
        finally
        {
            if (!success)
            {
                return defaultBytes;
            }
        }

        return null;
    }

    public byte[] generate() throws Exception
    {
        if (this.avatar == null || this.avatar.isEmpty())
        {
            return new byte[0];
        }
        boolean debugging = true;

        AvatarParts parts = Imaging.avatarParts;

        File output = new File("cache/avatar/" + this.avatar + ".png");
        Map<AvatarParts.Type, Integer> colors = new HashMap<>();
        Map<AvatarParts.Type, Integer> secondaryColor = new HashMap<>();
        if (!output.exists() || debugging)
        {
            //System.out.println("Parsing Look:" + this.avatar);
            BufferedImage image;
            if (this.headOnly)
            {
                if (this.size == AvatarSize.SMALL)
                {
                    image = new BufferedImage(27, 30, BufferedImage.TYPE_INT_ARGB);
                }
                else
                {
                    image = new BufferedImage(52, 62, BufferedImage.TYPE_INT_ARGB);
                }
            }
            else
            {
                image = new BufferedImage(this.size.size.x, this.size.size.y, BufferedImage.TYPE_INT_ARGB);
            }
            Graphics graphics = image.getGraphics();
            List<AvatarParts.SetPart> partList = new ArrayList<>(5);
            List<AvatarParts.Type> hiddenLayerList = new ArrayList<>(0);

            if (this.effect != null)
            {
                hiddenLayerList.addAll(this.effect.remove);
            }

            for (String part : this.avatar.split("\\."))
            {
                String[] definition = part.split("\\-");

                AvatarParts.Type type = AvatarParts.Type.fromString(definition[0]);

                if (this.headOnly && type.location != AvatarParts.BodyLocation.HEAD)
                {
                    continue;
                }

                if (definition.length >= 3)
                {
                    colors.put(type, Integer.valueOf(definition[2]));
                }
                else if (definition.length >= 4)
                {
                    secondaryColor.put(type, Integer.valueOf(definition[3]));
                }

                AvatarParts.Set set = parts.figureData.get(type).sets.get(Integer.valueOf(definition[1]));

                if (set != null)
                {
                    for (Map.Entry<AvatarParts.Type, List<AvatarParts.SetPart>> entry : set.parts.entrySet())
                    {
                        for (AvatarParts.SetPart p : entry.getValue())
                        {
                            if (p.type.rotationIndexOffset.containsKey(p.type.location == AvatarParts.BodyLocation.BODY ? this.direction : this.headDirection))
                            {
                                AvatarParts.SetPart clone = p.copy();
                                clone.order += p.type.rotationIndexOffset.get(p.type.location == AvatarParts.BodyLocation.BODY ? this.direction : this.headDirection);
                                partList.add(clone);
                            }
                            else
                            {
                                partList.add(p);
                            }
                        }

                        for (AvatarParts.Type t : set.hiddenLayers)
                        {
                            if (!hiddenLayerList.contains(t))
                            {
                                hiddenLayerList.add(t);
                            }
                        }
                    }
                }
                else
                {
                    //System.out.println("No Parts found for Set " + definition[1] + " of type " + type.key);
                }
            }

            if (this.carryItem > 0 && (this.actions.contains(AvatarAction.CARRY) || this.actions.contains(AvatarAction.DRINK)))
            {
                partList.add(new AvatarParts.SetPart(this.carryItem, AvatarParts.Type.RIGHT_HAND_ITEM, false, 0, 0));
//                AvatarParts.Set set = parts.figureData.get(AvatarParts.Type.RIGHT_HAND_ITEM).sets.get(this.carryItem);
//
//                for (Map.Entry<AvatarParts.Type, List<AvatarParts.SetPart>> entry : set.parts.entrySet())
//                {
//                    for (AvatarParts.SetPart p : entry.getValue())
//                    {
//                        partList.add(p);
//                    }
//
//                    for (AvatarParts.Type t : set.hiddenLayers)
//                    {
//                        if (!hiddenLayerList.contains(t))
//                        {
//                            hiddenLayerList.add(t);
//                        }
//                    }
//                }
            }

            Collections.sort(partList);


            if (this.size != AvatarSize.SMALL)
            {
                if (this.effect != null)
                {
                    for (Map.Entry<String, Boolean> entry : this.effect.sprites.entrySet())
                    {
                        try
                        {
                            partList.add(new AvatarParts.SetPart(Integer.valueOf(entry.getKey().replace("fx" + this.effect.id + "_", "")), AvatarParts.Type.EFFECT, entry.getValue(), 0, 0));
                        }
                        catch (Exception e)
                        {}
                    }
                }
            }

            for (AvatarParts.SetPart p : partList)
            {
                if (hiddenLayerList.contains(p.type))
                {
                    continue;
                }

                if (this.headOnly && p.type.location != AvatarParts.BodyLocation.HEAD)
                {
                    continue;
                }

                String name = this.size.prefix + "_%gesture%_" + p.type.key + (p.type == AvatarParts.Type.EFFECT ? this.effect.id + "_" + p.id + "_1_" + (p.colorable ? this.direction : "0") :  "_" + p.id + "_" + (p.type.location.equals(AvatarParts.BodyLocation.BODY) ? this.direction : this.headDirection))  + "_" + this.frame;

                Pair<BufferedImage, Point> data = null;

                if (this.gesture != AvatarGesture.NORMAL)
                {
                    data = parts.assetOffsetMap.get(name.replace("%gesture%", this.gesture.key));
                }

                if (p.type == AvatarParts.Type.HAIR && this.headDirection - 8 % 8  <= 0)
                {
                    continue;
                }

                if (data == null)
                {
                    for (AvatarAction action : this.actions)
                    {
                        //Items Are Carried in the right arm.
                        if ((p.type == AvatarParts.Type.LEFT_ARM_LARGE || p.type == AvatarParts.Type.LEFT_ARM_SMALL) && action == AvatarAction.CARRY)
                        {
                            continue;
                        }

                        data = parts.assetOffsetMap.get(name.replace("%gesture%", action.key));
                        if (data != null)
                        {
                            break;
                        }
                    }
                }

                if (data == null)
                {
                    data = parts.assetOffsetMap.get(name.replace("%gesture%",AvatarAction.STAND.key));
                }

                if (data != null)
                {
                    BufferedImage partImage = data.getKey();
                    if (p.type != AvatarParts.Type.EYE)
                    {
                        if ((p.type == AvatarParts.Type.FACIAL_CONTOURS || p.colorable) && ((colors.containsKey(p.type.colorFrom) && p.colorIndex == 1) || (secondaryColor.containsKey(p.type.colorFrom) && p.colorIndex == 2)))
                        {
                            boolean contains = parts.colorMap.containsKey(colors.get(p.type.colorFrom));

                            if (contains)
                            {
                                partImage = ImagingUtils.deepCopy(partImage);
                                Color color = parts.colorMap.get(p.colorIndex == 1 ? colors.get(p.type.colorFrom) : secondaryColor.get(p.type.colorFrom));
                                ImagingUtils.recolor(partImage, color);
                            }
                        }
                    }

                    boolean mirroredPart = false;
                    if (this.bodyMirrored && p.type.location == AvatarParts.BodyLocation.BODY || this.headMirrored && p.type.location == AvatarParts.BodyLocation.HEAD)
                    {
                        graphics.drawImage(partImage,
                                image.getWidth() - Math.abs(-data.getValue().x) - (this.headOnly ? (this.size == AvatarSize.SMALL ? 2 : 12) : 0), //Destination X1
                                image.getHeight() - data.getValue().y - 10  - (this.headOnly ? (this.size == AvatarSize.SMALL ? 25 : 46) : 0),  //Destination Y1
                                image.getWidth()  - Math.abs(-data.getValue().x) -  partImage.getWidth(),  //Destination X2
                                image.getHeight() - data.getValue().y - 10 + partImage.getHeight(),  //Destination Y2
                                0, //Source X1
                                0, //Source Y1
                                partImage.getWidth(), //Source X2
                                partImage.getHeight(), //Source Y2
                                null);
                    }
                    else
                    {
                        graphics.drawImage(partImage,
                                Math.abs(-data.getValue().x) - (this.headOnly ? (this.size == AvatarSize.SMALL ? 2 : 12) : 0),
                                image.getHeight() - data.getValue().y - 10 + (this.headOnly ? (this.size == AvatarSize.SMALL ? 25 : 44) : 0), null);
                    }
                }
                else
                {
                    System.out.println("Not Found: " + name);
                }
            }

            if (this.size.resize != 1.0)
            {
                BufferedImage realOutput = new BufferedImage((int)(image.getWidth() * this.size.resize), (int)(image.getHeight() * this.size.resize), BufferedImage.TYPE_INT_ARGB);
                Graphics2D graphics2D = realOutput.createGraphics();
                graphics2D.setComposite(AlphaComposite.Src);
                graphics2D.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_NEAREST_NEIGHBOR);
                graphics2D.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
                graphics2D.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                graphics2D.drawImage(image, 0, 0, realOutput.getWidth(), realOutput.getHeight(), null);
                image = realOutput;
                graphics2D.dispose();
            }

            ImageIO.write(image, "PNG", output);
        }

        return Files.readAllBytes(output.toPath());
    }

    private int directionFromParameter(Parameter parameter, int defaultValue)
    {
        if (parameter == null)
        {
            return defaultValue;
        }

        try
        {
            return Integer.valueOf(parameter.getValue());
        }
        catch (Exception e)
        {

        }

        return defaultValue;
    }

    private int frameFromParameter(Parameter parameter)
    {
        if (parameter == null)
        {
            return 0;
        }

        try
        {
            return Integer.valueOf(parameter.getValue());
        }
        catch (Exception e)
        {

        }

        return 0;
    }

    private boolean validAvatar(String look)
    {
        return true;
    }

    private boolean booleanFromParameter(Parameter parameter)
    {
        if (parameter == null || parameter.getValue() == null)
        {
            return false;
        }

        return parameter.getValue().equalsIgnoreCase("1");
    }

//    private class AvatarPart
//    {
//        public final String type;
//        public final int setId;
//        public final int colorId;
//        public final int rotation;
//        public final int frame;
//
//        private AvatarPart(String type, int setId, int colorId, int rotation, int frame)
//        {
//            this.type = type;
//            this.setId = setId;
//            this.colorId = colorId;
//            this.rotation = rotation;
//            this.frame = frame;
//        }
//    }
}
