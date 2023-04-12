package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.factory;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Locale;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import javax.xml.bind.annotation.XmlType;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;
import org.eclipse.bpmn2.Definitions;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.ActivityDescription;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.ApplyHierarchicalStructure;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.MinimizeGatewayHeterogeneity;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.MinimizeModelSize;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.ModelLoops;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.appearence.AssociateDataObject;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.appearence.AvoidOverlapping;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.appearence.LinearMessageFlows;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.appearence.LinearSequenceFlows;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.appearence.OrganizeArtifact;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.appearence.ProcessOrientation;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.appearence.StandardFormat;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling.DocumentMinorDetails;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling.LabelingANDGateways;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling.LabelingActivities;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling.LabelingConvergingGateways;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling.LabelingDataObject;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling.LabelingEvents;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling.LabelingLanes;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling.LabelingMessageEvent;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling.LabelingPools;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling.LabelingStartandEndEvents;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling.LabelingSynchronisedEndSplit;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling.LabelingXORGateway;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling.LoopMarkerAnnotation;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage.BalanceGateways;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage.ConsistentUsageEndEvents;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage.ConsistentUsageLanes;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage.ConsistentUsagePools;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage.ConsistentUsageStartEvents;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage.ExclusiveGatewayMarking;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage.ExplicitStartEndEvents;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage.RestrictUsageTerminateEndEvent;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage.SplitAndJoinFlows;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage.UsageDefaultFlows;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage.UsageInclusiveORGateways;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage.UsageMeaningfulGateways;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage.UsageMessageFlows;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage.explicitGateways;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.pattern.ScopeAttachedEvents;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = { "verificationType", "definitionID", "status", "description", "guidelines" })
@XmlRootElement(name = "UnderstandabilityResult")
public class GuidelinesFactory {

	@XmlElement(name = "VerificationType", required = true)
	private String verificationType;
	@XmlElement(name = "DefinitionID", required = true)
	private String definitionID;
	@XmlElement(name = "Status", required = true)
	private String status;
	@XmlElement(name = "Description", required = true)
	private String description;
	@XmlTransient
	private Definitions diagram;
	@XmlElementWrapper(name = "Guidelines", required = true)
	@XmlElement(name = "Guideline", required = true)
	private Collection<abstractGuideline> guidelines;

	@XmlTransient
	protected BlockingQueue<Runnable> threadPool;
	@XmlTransient
	private ExecutorService threadPoolExecutor;
	@XmlTransient
	private long lStartTime;
	@XmlTransient
	private Locale l;

	GuidelinesFactory() {

	}

	public GuidelinesFactory(Definitions graph) {
		diagram = graph;
		this.l = new Locale("en");
		init();
	}

	public GuidelinesFactory(Definitions graph, Locale l) {
		diagram = graph;
		this.l = l;
		init();
	}

	private void init() {
		guidelines = new ArrayList<abstractGuideline>();
		setDefinitionID(diagram.getId());
		// ** General
		guidelines.add(new MinimizeModelSize(diagram, l));
		guidelines.add(new ApplyHierarchicalStructure(diagram, l));
		//guidelines.add(new MinimizeConcurrency(diagram, l));
		guidelines.add(new ModelLoops(diagram, l));
		guidelines.add(new ActivityDescription(diagram, l));
		guidelines.add(new MinimizeGatewayHeterogeneity(diagram, l));
		// ** Notation Usage
		guidelines.add(new ConsistentUsagePools(diagram, l));
		guidelines.add(new ConsistentUsageLanes(diagram, l));
		guidelines.add(new ExplicitStartEndEvents(diagram, l));
		guidelines.add(new ConsistentUsageStartEvents(diagram, l));
		guidelines.add(new ConsistentUsageEndEvents(diagram, l));
		guidelines.add(new RestrictUsageTerminateEndEvent(diagram, l));
		guidelines.add(new explicitGateways(diagram, l));
		guidelines.add(new ExclusiveGatewayMarking(diagram, l));
		guidelines.add(new SplitAndJoinFlows(diagram, l));
		guidelines.add(new BalanceGateways(diagram, l));
		guidelines.add(new UsageMeaningfulGateways(diagram, l));
		guidelines.add(new UsageInclusiveORGateways(diagram, l));
		guidelines.add(new UsageDefaultFlows(diagram, l));
		guidelines.add(new UsageMessageFlows(diagram, l));
		// ** Labeling
		guidelines.add(new DocumentMinorDetails(diagram, l));
		guidelines.add(new LabelingPools(diagram, l));
		guidelines.add(new LabelingLanes(diagram, l));
		guidelines.add(new LabelingActivities(diagram, l));
		guidelines.add(new LabelingEvents(diagram, l));
		guidelines.add(new LabelingStartandEndEvents(diagram, l));
		guidelines.add(new LabelingMessageEvent(diagram, l));
		guidelines.add(new LabelingXORGateway(diagram, l));
		guidelines.add(new LabelingANDGateways(diagram, l));
		guidelines.add(new LabelingConvergingGateways(diagram, l));
		guidelines.add(new LabelingDataObject(diagram, l));
		guidelines.add(new LabelingSynchronisedEndSplit(diagram,l));
		guidelines.add(new LoopMarkerAnnotation(diagram, l));
		// ** Pattern
		guidelines.add(new ScopeAttachedEvents(diagram, l));
		// ** Appearence
		guidelines.add(new AvoidOverlapping(diagram, l));
		guidelines.add(new LinearSequenceFlows(diagram, l));
		guidelines.add(new LinearMessageFlows(diagram, l));
		guidelines.add(new ProcessOrientation(diagram, l));
		guidelines.add(new OrganizeArtifact(diagram, l));
		guidelines.add(new AssociateDataObject(diagram, l));
		guidelines.add(new StandardFormat(diagram, l));
		// guidelines.add(new (diagram,l));
		// guidelines.add(new (diagram,l));
		// guidelines.add(new (diagram,l));
		threadPool = new LinkedBlockingQueue<Runnable>();
		/*
		 * setProcessID(explicitSEevent.getProcessID());
		 */
	}

	public void StartSequential() {
		for (abstractGuideline abstractGuideline : guidelines) {
			abstractGuideline.Start();
		}
		setStatus();
	}

	public void StartThreadPool() {
		long keepAliveTime = 5000;

		threadPoolExecutor = new ThreadPoolExecutor(8, 10, keepAliveTime, TimeUnit.MILLISECONDS, threadPool);
		for (abstractGuideline abstractGuideline : guidelines) {
			threadPoolExecutor.execute(abstractGuideline);
		}
		lStartTime = System.currentTimeMillis();
		threadPoolExecutor.shutdown();

	}

	public boolean getStatusThreadPool() {
		boolean res = threadPoolExecutor.isTerminated();
		if (res) {
			setStatus();
			long lEndTime = System.currentTimeMillis();
			long difference = lEndTime - lStartTime;

			System.out.println("Guidelines Elapsed milliseconds: " + difference); //$NON-NLS-1$
		}
		return res;
	}

	public Collection<abstractGuideline> getGuidelines() {
		return guidelines;
	}

	public String getVerificationType() {
		return verificationType;
	}

	public void setVerificationType(String verificationType) {
		this.verificationType = verificationType;
	}

	public String getDefinitionID() {
		return definitionID;
	}

	public void setDefinitionID(String DefinitionID) {
		this.definitionID = DefinitionID;
	}

	public String getStatus() {
		return status;
	}

	private void setStatus() {
		status = Messages.getString("GuidelinesFactory.OK", l); //$NON-NLS-1$
		description = Messages.getString("GuidelinesFactory.OKDescription", l); //$NON-NLS-1$
		for (abstractGuideline abstractGuideline : guidelines) {
			if (!abstractGuideline.getStatus()) {
				status = Messages.getString("GuidelinesFactory.KO", l); //$NON-NLS-1$
				description = Messages.getString("GuidelinesFactory.KODescription", l); //$NON-NLS-1$
				break;
			}
		}
	}

	@Override
	public String toString() {
		String ret = "GuideLineFactory: \n\r"; //$NON-NLS-1$
		int index = 0;
		for (abstractGuideline bp : guidelines) {
			ret += ++index + ") "; //$NON-NLS-1$
			ret += bp.toString();
			ret += "\n\r-------------------------------------\n\r";
		}
		return ret;
	}

}
