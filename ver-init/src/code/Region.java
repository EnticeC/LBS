package code;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

public class Region implements Comparable<Region> {
    protected String id;
    protected String name;
    protected String cs;
    protected String address;
    protected String sales;

    public static List<Region> readRegionJsonFile(String jsonFname)
            throws JsonIOException, JsonSyntaxException, FileNotFoundException, IOException {
        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
        Type listType = new TypeToken<List<Region>>() {
        }.getType();
        List<Region> regions = gson.fromJson(new InputStreamReader(new FileInputStream(jsonFname), "UTF8"), listType);
        return regions;
    }

    /**
     * @return the id
     */
    public String getID() {
        return id;
    }

    /**
     * @param name the id to set
     */
    public void setID(String id) {
        this.id = id;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the id
     */
    public String getCS() {
        return cs;
    }

    /**
     * @param name the id to set
     */
    public void setCS(String cs) {
        this.cs = cs;
    }

    /**
     * @return the id
     */
    public String getAddress() {
        return address;
    }

    /**
     * @param name the id to set
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     * @return the id
     */
    public String getSales() {
        return sales;
    }

    /**
     * @param name the id to set
     */
    public void setSales(String sales) {
        this.sales = sales;
    }

    @Override
    public int compareTo(Region arg0) {
        // TODO Auto-generated method stub
        return 0;
    }

}
