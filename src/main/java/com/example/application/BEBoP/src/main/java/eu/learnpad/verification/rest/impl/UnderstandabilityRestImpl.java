package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.rest.impl;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Collection;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.xml.xpath.XPathConstants;

import org.w3c.dom.Document;
import org.w3c.dom.Node;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.factory.GuidelinesFactory;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.reader.MyBPMN2ModelReader;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.utils.XMLUtils;

@Path("validatemodel")
public class UnderstandabilityRestImpl {

	private static org.apache.log4j.Logger log = org.apache.log4j.Logger.getLogger(UnderstandabilityRestImpl.class);

	private static Map<Integer, GuidelinesFactory> map = new HashMap<Integer, GuidelinesFactory>();
	private static Integer id = 0;

	@Path("put")
	@POST
	@Consumes(MediaType.TEXT_PLAIN)
	public String putModel(String modelxml, @DefaultValue("en") @QueryParam("lang") String lang) {
		try {
			id++;
			if (!isOMGBPMN2(modelxml))
				return "";

			log.trace(lang);
			MyBPMN2ModelReader readerBPMN = new MyBPMN2ModelReader();
			Locale l = new Locale(lang);
			GuidelinesFactory eg = new GuidelinesFactory(readerBPMN.readStringModel(modelxml), l);
			eg.setVerificationType("UNDERSTANDABILITY");
			eg.StartThreadPool();
			map.put(id, eg);
			return id.toString();
		} catch (Exception e) {
			log.fatal("Fatal " + e.getMessage());
			return "FATAL ERROR";
		}
	}

	@Path("/{idmodel:\\d+}/status")
	@GET
	public String getStatusUnderstandabilityVerifications(@PathParam("idmodel") String modelID) {
		try {
			if (map.containsKey(Integer.valueOf(modelID))) {
				GuidelinesFactory ele = map.get(Integer.valueOf(modelID));
				if (ele.getStatusThreadPool()) {
					return "OK";
				} else
					return "IN PROGRESS";

			}
			// log.error("Element not found");
			return "ERROR";
		} catch (Exception e) {
			// log.fatal("Fatal "+e.getMessage());
			return "FATAL ERROR";
		}
	}

	@Path("/{idmodel:\\d+}")
	@GET
	@Produces(MediaType.APPLICATION_XML)
	public GuidelinesFactory getUnderstandabilityVerifications(@PathParam("idmodel") String modelID) {
		try {
			String guidelinesResult ="";
			if (map.containsKey(Integer.valueOf(modelID))) {
				GuidelinesFactory ele = map.get(Integer.valueOf(modelID));				
				
				if (ele.getStatusThreadPool()) {
					
					Collection<abstractGuideline> guidelines = ele.getGuidelines();
					
					for (abstractGuideline s : guidelines) {
				         guidelinesResult+=s.getStatus()+",";
				         //System.out.print(s.getid()+",");
				        }
					
									
					guidelinesResult+="\n";
					System.out.println("^^^^^^guidelinesResult: "+guidelinesResult);					
					String filePath = "/Users/fabriziofornari/Desktop/guidelines.txt";

					try(FileWriter fw = new FileWriter(filePath, true);
					BufferedWriter writer = new BufferedWriter(fw);) {

					  writer.write(guidelinesResult);

					}  

					
					
					//System.out.println("Ele: "+ele.toString());
					return ele;
				}

			}
			// log.error("Element not found");
			return null;
		} catch (Exception e) {
			// log.fatal("Fatal "+e.getMessage());
			return null;
		}
	}

	private boolean isOMGBPMN2(String modelS) {
		try {
			Document model = XMLUtils.getXmlDocFromString(modelS);
			String queryRoot = "/*[namespace-uri()='http://www.omg.org/spec/BPMN/20100524/MODEL' and local-name()='definitions']";
			Node bpmnRootNode = (Node) XMLUtils.execXPath(model.getDocumentElement(), queryRoot, XPathConstants.NODE);
			if (bpmnRootNode != null)
				return true;
		} catch (Exception e) {
			log.error(e);
			log.error("\nModel involved in the exception:\n" + modelS);

		}
		return false;
	}
}
