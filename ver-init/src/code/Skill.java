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

public class Skill implements Comparable<Skill> {
    protected String id;
    protected String name;

    public static List<Skill> readSkillJsonFile(String jsonFname)
            throws JsonIOException, JsonSyntaxException, FileNotFoundException, IOException {
        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
        Type listType = new TypeToken<List<Skill>>() {
        }.getType();
        List<Skill> skills = gson.fromJson(new InputStreamReader(new FileInputStream(jsonFname), "UTF8"), listType);
        return skills;
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

    @Override
    public int compareTo(Skill arg0) {
        // TODO Auto-generated method stub
        return 0;
    }

}
