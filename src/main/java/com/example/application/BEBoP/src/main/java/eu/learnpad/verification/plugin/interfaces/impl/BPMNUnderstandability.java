package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.interfaces.impl;

import java.io.File;
import java.io.StringWriter;
import java.util.Locale;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import javax.xml.xpath.XPathConstants;

import org.w3c.dom.Document;
import org.w3c.dom.Node;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.factory.GuidelinesFactory;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.reader.MyBPMN2ModelReader;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.interfaces.Plugin;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.utils.XMLUtils;

public class BPMNUnderstandability implements Plugin {

	private static org.apache.log4j.Logger log = org.apache.log4j.Logger.getLogger(BPMNUnderstandability.class);

	private boolean isOMGBPMN2(String modelS) {
		try {
			Document model = XMLUtils.getXmlDocFromString(modelS);
			String queryRoot = "/*[namespace-uri()='http://www.omg.org/spec/BPMN/20100524/MODEL' and local-name()='definitions']";
			Node bpmnRootNode = (Node) XMLUtils.execXPath(model.getDocumentElement(), queryRoot, XPathConstants.NODE);
			if (bpmnRootNode != null)
				return true;
		} catch (Exception e) {
			log.error(e);
			log.error("Model involved in the exception:\n" + modelS);

		}
		return false;
	}

	@Override
	public String[] getVerificationTypeProvided() {
		return new String[] { "UNDERSTANDABILITY" };
	}

	@Override
	public String performVerification(String model, String type) {
		String ret = "";
		try {

			if (type.equals("UNDERSTANDABILITY")) {

				if (!isOMGBPMN2(model))
					return "";

				MyBPMN2ModelReader readerBPMN = new MyBPMN2ModelReader();
				String lang = "en";
				String country = "US";
				Locale l = new Locale(lang, country);
				GuidelinesFactory eg = new GuidelinesFactory(readerBPMN.readStringModel(model), l);
				eg.setVerificationType("UNDERSTANDABILITY");
				eg.StartSequential();
				// System.out.println(eg);

				JAXBContext jaxbContext = JAXBContext.newInstance(GuidelinesFactory.class);
				Marshaller jaxbMarshaller = jaxbContext.createMarshaller();

				// output pretty printed
				jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
				jaxbMarshaller.setProperty(Marshaller.JAXB_FRAGMENT, true);

				StringWriter w = new StringWriter();
				// jaxbMarshaller.marshal(eg, System.out);
				jaxbMarshaller.marshal(eg, w);

				ret = w.toString();
			} else
				throw new Exception("ERROR: Verification type " + type + " not supported.");
		} catch (Exception ex) {
			// ex.printStackTrace();
			log.error(ex);
			log.error("\nModel involved in the exception:\n" + model);
			ret = "<ErrorResult><Status>ERROR</Status><Description>" + ex.getMessage() + "</Description></ErrorResult>";
		}
		return ret;
	}

	public static void main(String[] args) {
		try {
			if (args[0] != null) {
				MyBPMN2ModelReader readerBPMN = new MyBPMN2ModelReader();
				File file = new File(args[0]);
				String lang = "en";
				String country = "US";
				Locale l = new Locale(lang, country);
				GuidelinesFactory eg = new GuidelinesFactory(readerBPMN.readFileModel(file.getAbsolutePath()),l);
				System.out.println(eg);

				JAXBContext jaxbContext = JAXBContext.newInstance(GuidelinesFactory.class);
				Marshaller jaxbMarshaller = jaxbContext.createMarshaller();

				// output pretty printed
				jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

				jaxbMarshaller.marshal(eg, System.out);
			}

			// System.out.println("");

		} catch (Exception ex) {
			log.error(ex);
		}
	}

}

/*
 * 
 * @startuml abstract class abstractGuideline { #Collection<FlowElement>
 * elementsBPMN #boolean status #String NameProcess #String IDProcess #String id
 * #String Name #String Description #String Suggestion #Collection<String>
 * Elements ~abstractGuideline() ~abstractGuideline(List<RootElement> diagram)
 * #{abstract}void findGL(List<RootElement> diagram) +boolean getStatus()
 * +String toString() +String getid() +void setElements(String element) +String
 * getDescription() +String getName() +String getProcessName() +String
 * getProcessID() +String getSuggestion() #{abstract}int
 * searchSubProcess(SubProcess sub, String ret, int i) } class explicitGateways
 * { ~explicitGateways() +explicitGateways(List<RootElement> diagram) +void
 * findGL(List<RootElement> diagram) #int searchSubProcess(SubProcess sub,
 * String ret, int i) }
 * 
 * class ExplicitStartEndEvents { +ExplicitStartEndEvents(List<RootElement>
 * diagram) #void findGL(List<RootElement> diagram) #int
 * searchSubProcess(SubProcess sub, String ret, int i) } class GuidelinesFactory
 * { -String processName -String processID -String status -String description
 * -List<RootElement> diagram -Collection<abstractGuideline> guidelines
 * ~GuidelinesFactory() +GuidelinesFactory(List<RootElement> graph)
 * +Collection<abstractGuideline> getGuidelines() +String getProcessName() +void
 * setProcessName(String nameProcess) +String getProcessID() +void
 * setProcessID(String processID) +String getStatus() -void setStatus() +String
 * toString() } abstractGuideline <|-- ExplicitStartEndEvents abstractGuideline
 * <|-- explicitGateways GuidelinesFactory --> abstractGuideline
 * 
 * class MyBPMN2ModelReader { +MyBPMN2ModelReader() +List<RootElement>
 * readStringModel(String theBPMNString) +List<RootElement> readFileModel(String
 * theBPMNFile) +void ReadThisModel(String theBPMNFile) -{static}Definitions
 * getDefinitions(Resource resource) }
 * 
 * class BPMNUnderstandability { +String[] getVerificationTypeProvided() +String
 * performVerification(String model, String type) +{static}void main(String[]
 * args) } interface Plugin { } Plugin <|.. BPMNUnderstandability
 * BPMNUnderstandability --> MyBPMN2ModelReader BPMNUnderstandability -->
 * GuidelinesFactory
 * 
 * @enduml
 * 
 */
