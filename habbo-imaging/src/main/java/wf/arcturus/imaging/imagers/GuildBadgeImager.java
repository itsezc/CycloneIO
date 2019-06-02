package wf.arcturus.imaging.imagers;

import wf.arcturus.Imaging;
import wf.arcturus.imaging.GuildParts;
import wf.arcturus.imaging.ImagingUtils;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;

public class GuildBadgeImager extends Imager
{
    private String badge;

    public GuildBadgeImager(String badge)
    {
        super(null);

        if (this.validBadge(badge))
        {
            this.badge = badge;
        }
    }

    @Override
    public byte[] output()
    {
        try
        {
            return Files.readAllBytes(generate(this.badge).toPath());
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        return new byte[0];
    }


    public File generate(String badge)
    {
        File outputFile;
        try
        {
            outputFile = new File("cache/badge/" + badge + ".png");

            if (outputFile.exists())
                return outputFile;
        }
        catch (Exception e)
        {
            return null;
        }

        String[] parts = new String[]{"", "", "", "", ""};

        int count = 0;

        try
        {
            for (int i = 0; i < badge.length(); )
            {
                if (i > 0)
                {
                    if (i % 7 == 0)
                    {
                        count++;
                    }
                }

                for (int j = 0; j < 7; j++)
                {
                    parts[count] += badge.charAt(i);
                    i++;
                }
            }
        }
        catch (Exception e)
        {
            return null;
        }


        BufferedImage image = new BufferedImage(39, 39, BufferedImage.TYPE_INT_ARGB);
        Graphics graphics   = image.getGraphics();

        for (String s : parts)
        {
            if(s.isEmpty())
                continue;

            String type     = s.charAt(0) + "";
            int id          = Integer.valueOf(s.substring(1, 4));
            int c           = Integer.valueOf(s.substring(4, 6));
            int position    = Integer.valueOf(s.substring(6));

            GuildParts.Part part;
            GuildParts.Part color = Imaging.guildParts.getPart(GuildParts.Type.BASE_COLOR, c);

            if (type.equalsIgnoreCase("b"))
            {
                part = Imaging.guildParts.getPart(GuildParts.Type.BASE, id);
            }
            else
            {
                part = Imaging.guildParts.getPart(GuildParts.Type.SYMBOL, id);
            }

            BufferedImage imagePart = ImagingUtils.deepCopy(Imaging.guildParts.cachedImages.get(part.valueA));

            Point point;

            if (imagePart != null)
            {
                if (imagePart.getColorModel().getPixelSize() < 32)
                {
                    imagePart = ImagingUtils.convert32(imagePart);
                }

                point = ImagingUtils.getPoint(image, imagePart, position);

                ImagingUtils.recolor(imagePart, ImagingUtils.colorFromHexString(color.valueA));

                graphics.drawImage(imagePart, point.x, point.y, null);
            }

            if (!part.valueB.isEmpty())
            {
                imagePart = ImagingUtils.deepCopy(Imaging.guildParts.cachedImages.get(part.valueB));

                if (imagePart != null)
                {
                    if (imagePart.getColorModel().getPixelSize() < 32)
                    {
                        imagePart = ImagingUtils.convert32(imagePart);
                    }

                    point = ImagingUtils.getPoint(image, imagePart, position);
                    graphics.drawImage(imagePart, point.x, point.y, null);
                }
            }
        }

        try
        {
            ImageIO.write(image, "PNG", outputFile);
        }
        catch (Exception e)
        {
            return null;
        }

        graphics.dispose();
        return outputFile;
    }

    private boolean validBadge(String badge)
    {
        return true;
    }
}
