package wf.arcturus.imaging;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.ColorConvertOp;
import java.awt.image.ColorModel;
import java.awt.image.WritableRaster;

public class ImagingUtils
{
    public static BufferedImage deepCopy(BufferedImage bi)
    {
        if(bi == null)
            return null;

        ColorModel cm = bi.getColorModel();
        boolean isAlphaPremultiplied = cm.isAlphaPremultiplied();
        WritableRaster raster = bi.copyData(null);
        return new BufferedImage(cm, raster, isAlphaPremultiplied, null);
    }

    public static void recolor(BufferedImage image, Color maskColor)
    {
        for (int x = 0; x < image.getWidth(); x++)
        {
            for (int y = 0; y < image.getHeight(); y++)
            {
                int pixel = image.getRGB(x, y);

                if((pixel >> 24) == 0x00)
                    continue;

                Color color = new Color(pixel);

                float alpha = (color.getAlpha() / 255.0F) * (maskColor.getAlpha() / 255.0F);
                float red   = (color.getRed()   / 255.0F) * (maskColor.getRed()   / 255.0F);
                float green = (color.getGreen() / 255.0F) * (maskColor.getGreen() / 255.0F);
                float blue  = (color.getBlue()  / 255.0F) * (maskColor.getBlue()  / 255.0F);
//
//                if (image.isAlphaPremultiplied())
//                {
//                    red   = red   * alpha / 255;
//                    green = green * alpha / 255;
//                    blue  = blue  * alpha / 255;
//                }

//                int alpha = (color.getAlpha() & 0xFF);
//                int red   = (color.getRed()   & 0xFF);
//                int green = (color.getGreen() & 0xFF);
//                int blue  = (color.getBlue()  & 0xFF);
//
//                if(image.isAlphaPremultiplied())
//                {
//                    red |= maskColor.getRed();
//                    green |= maskColor.getGreen();
//                    blue |= maskColor.getBlue();
//                }
//                else
//                {
//                    red &= maskColor.getRed();
//                    green &= maskColor.getGreen();
//                    blue &= maskColor.getBlue();
//                }
//
//                if((pixel | 0xFF000000) == 0xFFFFFFFF)
//                {
//                    color = maskColor;
//                }
//                else
//                {
                color = new Color(red, green, blue, alpha);
//                }

                int rgb = color.getRGB();
                image.setRGB(x, y, rgb);
            }
        }
    }

    public static Color colorFromHexString(String colorStr)
    {
        try
        {
            return new Color(
                    Integer.valueOf(colorStr, 16));
        }
        catch (Exception e)
        {
            return new Color(0xffffff);
        }
    }

    public static Point getPoint(BufferedImage image, BufferedImage imagePart, int position)
    {
        int x = 0;
        int y = 0;

        if (position == 1)
        {
            x = (image.getWidth() - imagePart.getWidth()) / 2;
            y = 0;
        }
        else if (position == 2)
        {
            x = image.getWidth() - imagePart.getWidth();
            y = 0;
        }
        else if(position == 3)
        {
            x = 0;
            y = (image.getHeight() / 2) - (imagePart.getHeight() / 2);
        }
        else if(position == 4)
        {
            x = (image.getWidth() / 2) - (imagePart.getWidth() / 2);
            y = (image.getHeight() / 2) - (imagePart.getHeight() / 2);
        }
        else if(position == 5)
        {
            x = image.getWidth() - imagePart.getWidth();
            y = (image.getHeight() / 2) - (imagePart.getHeight() / 2);
        }
        else if(position == 6)
        {
            x = 0;
            y = image.getHeight() - imagePart.getHeight();
        }
        else if(position == 7)
        {
            x = ((image.getWidth() - imagePart.getWidth()) / 2);
            y = image.getHeight() - imagePart.getHeight();
        }
        else if(position == 8)
        {
            x = image.getWidth() - imagePart.getWidth();
            y = image.getHeight() - imagePart.getHeight();
        }

        return new Point(x, y);
    }

    public static BufferedImage convert32(BufferedImage src)
    {
        BufferedImage dest = new BufferedImage(src.getWidth(), src.getHeight(), BufferedImage.TYPE_INT_ARGB);
        ColorConvertOp cco = new ColorConvertOp(src.getColorModel().getColorSpace(), dest.getColorModel().getColorSpace(), null);
        return cco.filter(src, dest);
    }
}
