package wf.arcturus.imaging.imagers;

import org.restlet.data.Form;

public abstract class Imager
{
    protected Form parameters;

    public Imager(Form parameters)
    {
        this.parameters = parameters;
    }

    public abstract byte[] output();
}
