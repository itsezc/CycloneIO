package wf.arcturus.imaging;

import javafx.util.Pair;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.imageio.ImageIO;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AvatarParts
{
    public static final String XML_FOLDER = "resources/xml/";
    public static final String AVATAR_FOLDER = "resources/avatar/";
    public static final String FIGURE_DATA = "figuredata.xml";
    public static final String FIGURE_MAP = "figuremap.xml";

    public Map<Type, SetType> figureData = new HashMap<>();
    public Map<Integer, String> figureMap = new HashMap<>();
    public Map<String, Pair<BufferedImage, Point>> assetOffsetMap = new HashMap<>();
    public Map<Integer, Color> colorMap = new HashMap<>();
    public Map<Integer, FX> effectMap = new HashMap<>();

    public AvatarParts() throws Exception
    {
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        Document doc = dBuilder.parse(new File(XML_FOLDER + FIGURE_MAP));
        doc.getDocumentElement().normalize();

        NodeList clothingList = doc.getElementsByTagName("lib");
        for (int index = 0; index < clothingList.getLength(); index++)
        {
            Node node = clothingList.item(index);

            if (node.getNodeType() == Node.ELEMENT_NODE)
            {
                if (((Element)node).getAttribute("id").startsWith("hh_"))
                {
                    continue;
                }

                NodeList libNodes = node.getChildNodes();

                for (int childIndex = 0; childIndex < libNodes.getLength(); childIndex++)
                {
                    Node childNode = libNodes.item(childIndex);

                    if (childNode.getNodeType() == Node.ELEMENT_NODE)
                    {
                        this.figureMap.put(Integer.valueOf(((Element) childNode).getAttribute("id")), ((Element) node).getAttribute("id"));
                    }
                }
            }
        }

        doc = dBuilder.parse(new File(XML_FOLDER + FIGURE_DATA));
        doc.getDocumentElement().normalize();

        NodeList paletteList = doc.getElementsByTagName("palette");

        for (int index = 0; index < paletteList.getLength(); index++)
        {
            Node nNode = paletteList.item(index);
            if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                Element eElement = (Element) nNode;
                //Palette palette = new Palette(Integer.valueOf(eElement.getAttribute("id")));

                NodeList childNodes = eElement.getChildNodes();
                for (int childNodeIndex = 0; childNodeIndex < childNodes.getLength(); childNodeIndex++)
                {
                    Node childNode = childNodes.item(childNodeIndex);

                    if (childNode.getNodeType() == Node.ELEMENT_NODE)
                    {
                        this.colorMap.put(Integer.valueOf(((Element)childNode).getAttribute("id")), Color.decode("#" + childNode.getTextContent()));
                        /*palette.colorMap.put(Integer.valueOf(((Element)childNode).getAttribute("id")), new PaletteColor(
                                Integer.valueOf(((Element)childNode).getAttribute("id")),
                                Integer.valueOf(((Element) childNode).getAttribute("index")),
                                Integer.valueOf(((Element)childNode).getAttribute("club")),
                                        ((Element)childNode).getAttribute("selectable").equals("1"),
                                Color.decode("#" + childNode.getTextContent())
                        ));*/
                    }
                }
            }
        }

        NodeList setTypesList = doc.getElementsByTagName("settype");

        for (int index = 0; index < setTypesList.getLength(); index++)
        {
            Node setList = setTypesList.item(index);

            if (setList.getNodeType() == Node.ELEMENT_NODE)
            {
                SetType setType = new SetType(Type.fromString(((Element) setList).getAttribute("type")), Integer.valueOf(((Element)setList).getAttribute("paletteid")));

                NodeList setsList = setList.getChildNodes();

                for (int childNodeIndex = 0; childNodeIndex < setsList.getLength(); childNodeIndex++)
                {
                    Node setNode = setsList.item(childNodeIndex);

                    if (setNode.getNodeType() == Node.ELEMENT_NODE)
                    {
                        try
                        {
                            Set set = new Set(Integer.valueOf(((Element) setNode).getAttribute("id")),
                                    this.figureMap.get(Integer.valueOf(((Element) setNode).getAttribute("id"))),
                                    ((Element) setNode).getAttribute("gender"),
                                    Integer.valueOf(((Element) setNode).getAttribute("club")),
                                    ((Element) setNode).getAttribute("colorable").equals("1"),
                                    ((Element) setNode).getAttribute("selectable").equals("1"),
                                    ((Element) setNode).getAttribute("preselectable").equals("1")
                            );

                            setType.sets.put(set.id, set);

                            NodeList partsList = ((Element) setNode).getElementsByTagName("part");

                            for (int partsIndex = 0; partsIndex < partsList.getLength(); partsIndex++)
                            {
                                Node partNode = partsList.item(partsIndex);

                                if (partNode.getNodeType() == Node.ELEMENT_NODE)
                                {
                                    SetPart part = new SetPart(Integer.valueOf(((Element) partNode).getAttribute("id")),
                                            Type.fromString(((Element) partNode).getAttribute("type")),
                                            ((Element) partNode).getAttribute("colorable").equals("1"),
                                            Integer.valueOf(((Element) partNode).getAttribute("index")),
                                            Integer.valueOf(((Element) partNode).getAttribute("colorindex"))
                                    );

                                    set.addPart(part);
                                }
                            }

                            NodeList hiddenLayerList = ((Element) setNode).getElementsByTagName("layer");
                            for (int hiddenLayerIndex = 0; hiddenLayerIndex < hiddenLayerList.getLength(); hiddenLayerIndex++)
                            {
                                Node hiddenLayer = hiddenLayerList.item(hiddenLayerIndex);

                                if (hiddenLayer.getNodeType() == Node.ELEMENT_NODE)
                                {
                                    set.hiddenLayers.add(Type.fromString(((Element)hiddenLayer).getAttribute("parttype")));
                                }
                            }
                        }
                        catch (Exception ex)
                        {}
                    }
                }

                this.figureData.put(setType.type, setType);
            }
        }

        for (File file : new File(XML_FOLDER + "assets/").listFiles())
        {
            try
            {
                if (file.getName().contains(".bin"))
                {
                    doc = dBuilder.parse(file);
                    doc.getDocumentElement().normalize();

                    NodeList assetNodes = doc.getElementsByTagName("asset");

                    for (int index = 0; index < assetNodes.getLength(); index++)
                    {
                        Node node = assetNodes.item(index);

                        if (node.getNodeType() == Node.ELEMENT_NODE)
                        {
                            if (((Element) node).getAttribute("mimeType").equalsIgnoreCase("image/png"))
                            {
                                Element e = ((Element) ((Element) node).getElementsByTagName("param").item(0));

                                if (e != null)
                                {
                                    String offset = e.getAttribute("value");

                                    if (!offset.isEmpty())
                                    {
                                        String[] data = offset.split(",");

                                        if (data.length == 2)
                                        {
                                            File f = new File(AVATAR_FOLDER + ((Element) node).getAttribute("name") + ".png");

                                            if (f.exists())
                                            {
                                                try
                                                {
                                                    this.assetOffsetMap.put(((Element) node).getAttribute("name"), new Pair<>(ImageIO.read(f), new Point(Integer.valueOf(data[0]), Integer.valueOf(data[1]))));
                                                } catch (Exception ex)
                                                {
                                                    //System.out.println("Failed to read " + f.getName());
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (file.getName().equalsIgnoreCase("hh_human_item_manifest.bin"))
                        {

                        }
                    }
                }
            }
            catch (Exception e)
            {}
        }

        File effectMap = new File(XML_FOLDER + "effectmap.xml");
        if (!effectMap.exists())
        {
            throw new Exception("effectmap.xml is missing!");
        }

        doc = dBuilder.parse(effectMap);
        doc.getDocumentElement().normalize();
        NodeList effectNodes = doc.getElementsByTagName("effect");
        for (int index = 0; index < effectNodes.getLength(); index++)
        {
            Node node = effectNodes.item(index);

            if (node.getNodeType() == Node.ELEMENT_NODE)
            {
                if (((Element)node).getAttribute("type").equalsIgnoreCase("fx"))
                {
                    int id = Integer.valueOf(((Element) node).getAttribute("id"));
                    String name = ((Element) node).getAttribute("lib");
                    this.effectMap.put(id, new FX(id, name));
                }
            }
        }

        for (Map.Entry<Integer, FX> effectEntry : this.effectMap.entrySet())
        {
            File animationFile = new File(XML_FOLDER + "fx/" + effectEntry.getValue().name + "_animation.bin");
            try
            {
                doc = dBuilder.parse(animationFile);
                doc.getDocumentElement().normalize();

                NodeList assetNodes = doc.getElementsByTagName("sprite");

                Map<String, Boolean> sprites = new HashMap<>();
                for (int index = 0; index < assetNodes.getLength(); index++)
                {
                    Node node = assetNodes.item(index);

                    if (node.getNodeType() == Node.ELEMENT_NODE)
                    {
                        sprites.put(((Element) node).getAttribute("id"), ((Element) node).hasAttribute("directions") ? ((Element) node).getAttribute("directions").equals("1") : false);
                    }
                }

                List<Type> remove = new ArrayList<>();
                assetNodes = doc.getElementsByTagName("remove");
                for (int index = 0; index < assetNodes.getLength(); index++)
                {
                    Node node = assetNodes.item(index);

                    if (node.getNodeType() == Node.ELEMENT_NODE)
                    {
                        remove.add(Type.fromString(((Element) node).getAttribute("id")));
                    }
                }

                effectEntry.getValue().remove = remove;
                effectEntry.getValue().sprites = sprites;
            } catch (Exception e)
            {

            }

            File assetsFile = new File(XML_FOLDER + "fx/" + effectEntry.getValue().name + "_manifest.bin");

            try
            {
                if (assetsFile.getName().contains(".bin"))
                {
                    doc = dBuilder.parse(assetsFile);
                    doc.getDocumentElement().normalize();

                    NodeList assetNodes = doc.getElementsByTagName("asset");

                    for (int index = 0; index < assetNodes.getLength(); index++)
                    {
                        Node node = assetNodes.item(index);

                        if (node.getNodeType() == Node.ELEMENT_NODE)
                        {
                            if (((Element) node).getAttribute("mimeType").equalsIgnoreCase("image/png"))
                            {
                                Element e = ((Element) ((Element) node).getElementsByTagName("param").item(0));

                                if (e != null)
                                {
                                    String offset = e.getAttribute("value");

                                    if (!offset.isEmpty())
                                    {
                                        String[] data = offset.split(",");

                                        if (data.length == 2)
                                        {
                                            File f = new File(AVATAR_FOLDER + ((Element) node).getAttribute("name") + ".png");

                                            if (f.exists())
                                            {
                                                try
                                                {
                                                    this.assetOffsetMap.put(((Element) node).getAttribute("name"), new Pair<>(ImageIO.read(f), new Point(Integer.valueOf(data[0]), Integer.valueOf(data[1]))));
                                                } catch (Exception ex)
                                                {
                                                    //System.out.println("Failed to read " + f.getName());
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
            catch (Exception e)
            {

            }
        }


        System.out.println("Loaded " + this.assetOffsetMap.size() + " assets!");
        System.out.println("Loaded " + this.effectMap.size() + " effects!");
    }

    public static class SetType
    {
        public final Type type;
        public final int paletteId;
        public final Map<Integer, Set> sets = new HashMap<>(10);

        public SetType(Type type, int paletteId)
        {
            this.type = type;
            this.paletteId = paletteId;
        }
    }

    public class Set
    {
        public final int id;
        public final String name;
        public final String gender;
        public final int club;
        public final boolean colorable;
        public final boolean selectable;
        public final boolean preselectable;

        public final Map<Type, List<SetPart>> parts = new HashMap<>(1);
        public final List<Type> hiddenLayers = new ArrayList<>(0);

        public Set(int id, String name, String gender, int club, boolean colorable, boolean selectable, boolean preselectable)
        {
            this.id = id;
            this.name = name;
            this.gender = gender;
            this.club = club;
            this.colorable = colorable;
            this.selectable = selectable;
            this.preselectable = preselectable;
        }

        public void addPart(SetPart part)
        {
            if (!this.parts.containsKey(part.type))
            {
                this.parts.put(part.type, new ArrayList<>());
            }

            this.parts.get(part.type).add(part);
        }
    }

    public static class SetPart implements Comparable<SetPart>
    {
        public final int id;
        public final Type type;
        public final boolean colorable;
        public final int index;
        public final int colorIndex;
        public int order;

        public SetPart(int id, Type type, boolean colorable, int index, int colorIndex)
        {
            this.id = id;
            this.type = type;
            this.colorable = colorable;
            this.index = index;
            this.colorIndex = colorIndex;
            this.order = this.type.order;
        }

        @Override
        public String toString()
        {
            return "SetPart (id: " + this.id + ", type: " + this.type + ")";
        }

        @Override
        public int compareTo(SetPart o)
        {
            return this.order - o.order;
        }

        public SetPart copy()
        {
            return new SetPart(this.id, this.type, this.colorable, this.index, this.colorIndex);
        }
    }

    public enum BodyLocation
    {
        HEAD,
        BODY;
    }

    public enum Type
    {
        SHOES("sh", BodyLocation.BODY, 5, false), //Shoes
        LEGS("lg", BodyLocation.BODY, 6, false), //Trousers / pants / kilt
        CHEST("ch", BodyLocation.BODY, 7, false), //Shirts
        WAIST("wa", BodyLocation.BODY, 8, false), //Waist. Belts
        CHEST_ACCESSORY("ca", BodyLocation.BODY, 9, false), //Necklaces
        FACE_ACCESSORY("fa", BodyLocation.HEAD, 27, false), //Mask etc
        EYE_ACCESSORY("ea", BodyLocation.HEAD, 28, false), //Sunglasses etc
        HEAD_ACCESSORY("ha", BodyLocation.HEAD, 29, false), //Hats
        HEAD_EXTRA("he", BodyLocation.HEAD, 20, false), //Bowtie in hair
        CHEST_COVER("cc", BodyLocation.BODY, 21, false), //Jackets
        CHEST_PIECE("cp", BodyLocation.BODY, 6, false), //Tattoos and stuff
        FACIAL_CONTOURS("fc", BodyLocation.HEAD, 23, false),
        HEAD("hd", BodyLocation.HEAD, 22, true),
        BODY("bd", BodyLocation.BODY, 1, true), //Body
        HAIR("hr", BodyLocation.HEAD, 24, false),
        LEFT_ARM_LARGE("lh", BodyLocation.BODY, 5, true),
        LEFT_ARM_SMALL("ls", BodyLocation.BODY, 6, false),
        RIGHT_ARM_LARGE("rh", BodyLocation.BODY, 10, false),
        RIGHT_ARM_SMALL("rs", BodyLocation.BODY, 11, false),
        EYE("ey", BodyLocation.HEAD, 24, false),
        LEFT_HAND_ITEM("li", BodyLocation.BODY, 0, false),
        HAIR_BACK("hrb", BodyLocation.HEAD, 26, false), //Hair when laying
        RIGHT_HAND_ITEM("ri", BodyLocation.BODY, 26, true),
        LEFT_ARM_CARRY("lc", BodyLocation.BODY, 23, true),
        RIGHT_ARM_CARRY("rc", BodyLocation.BODY, 24, true),
        EFFECT("fx", BodyLocation.BODY, 100, false);

        public final String key;
        public final int order;
        public final BodyLocation location;
        public Type colorFrom;
        public final Map<Integer, Integer> rotationIndexOffset = new HashMap<>();

        static
        {
            FACIAL_CONTOURS.colorFrom = HEAD;
            BODY.colorFrom = HEAD;
            HAIR_BACK.colorFrom = HAIR;
            LEFT_ARM_CARRY.colorFrom = HEAD;
            RIGHT_ARM_CARRY.colorFrom = HEAD;
            HAIR_BACK.colorFrom = HAIR;

            LEFT_ARM_LARGE.colorFrom = HEAD;
            RIGHT_ARM_LARGE.colorFrom = HEAD;
            LEFT_ARM_SMALL.colorFrom = CHEST;
            RIGHT_ARM_SMALL.colorFrom = CHEST;

            LEFT_ARM_SMALL.rotationIndexOffset.put(3, 1);
        }
        private Type(String key, BodyLocation location, int order, boolean unused)
        {
            this.key = key;
            this.location = location;
            this.order = order;
            this.colorFrom = this;
        }

        public static Type fromString(String key)
        {
            for (Type type : values())
            {
                if (type.key.equalsIgnoreCase(key))
                {
                    return type;
                }
            }

            throw new RuntimeException("Failed to find Type of : " + key);
        }
    }

    public static class Palette
    {
        public final int id;
        public Map<Integer, PaletteColor> colorMap = new HashMap<>();

        public Palette(int id)
        {
            this.id = id;
        }
    }

    public static class PaletteColor
    {
        public final int id;
        public final int index;
        public final int club;
        public final boolean selectable;
        public final Color color;

        public PaletteColor(int id, int index, int club, boolean selectable, Color color)
        {
            this.id = id;
            this.index = index;
            this.club = club;
            this.selectable = selectable;
            this.color = color;
        }
    }

    public static class FX
    {
        public final int id;
        public final String name;
        public Map<String, Boolean> sprites = new HashMap<>(); //String, Directions
        public List<Type> remove = new ArrayList<>();

        public FX(int id, String name)
        {
            this.id = id;
            this.name = name;
        }
    }
}
