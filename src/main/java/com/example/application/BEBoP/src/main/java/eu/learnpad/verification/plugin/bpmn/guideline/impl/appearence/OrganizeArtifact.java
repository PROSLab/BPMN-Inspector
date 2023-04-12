package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.appearence;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.eclipse.bpmn2.Activity;
import org.eclipse.bpmn2.BaseElement;
import org.eclipse.bpmn2.DataInputAssociation;
import org.eclipse.bpmn2.DataObjectReference;
import org.eclipse.bpmn2.DataOutputAssociation;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.ItemAwareElement;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.di.BPMNEdge;
import org.eclipse.dd.dc.Point;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.reader.BPMNUtils;

public class OrganizeArtifact extends abstractGuideline {

	public OrganizeArtifact(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "48"; //$NON-NLS-1$
		this.Description = Messages.getString("OrganizeArtifact.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("OrganizeArtifact.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {

		int num = 0;
		Map<Activity, List<DataInputAssociation>> mappaI = new HashMap<Activity, List<DataInputAssociation>>();
		Map<Activity, List<DataOutputAssociation>> mappaO = new HashMap<Activity, List<DataOutputAssociation>>();
		Map<BaseElement, BPMNEdge> BPMNEdges = BPMNUtils.getAllBPMNEdge(diagram);

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				IDProcess = process.getId();
				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof DataObjectReference) {
						DataObjectReference data = (DataObjectReference) fe;
						for (FlowElement flow : process.getFlowElements()) {
							if (flow instanceof Activity) {
								Activity activity = (Activity) flow;
								for (DataInputAssociation input : activity.getDataInputAssociations()) {
									if (input.getSourceRef().contains(data)) {
										if (mappaI.get(activity) == null) {
											mappaI.put(activity, new ArrayList<DataInputAssociation>());
										}
										(mappaI.get(activity)).add(input);
									}
								}
								for (DataOutputAssociation output : activity.getDataOutputAssociations()) {
									if (output.getTargetRef().getId().equals(data.getId())) {
										if (mappaO.get(activity) == null) {
											mappaO.put(activity, new ArrayList<DataOutputAssociation>());
										}
										(mappaO.get(activity)).add(output);
									}
								}
							}
						}
					}
				}
			}
		}

		for (Activity in : mappaI.keySet()) {
			List<DataInputAssociation> inputs = mappaI.get(in);
			if (!inputs.isEmpty()) {
				DataInputAssociation i1 = null;
				for (DataInputAssociation i2 : inputs) {
					if (i1 == null) {
						i1 = i2;
					} else {
						List<Point> p1 = new ArrayList<Point>();
						List<Point> p2 = new ArrayList<Point>();
						for (BaseElement base : BPMNEdges.keySet()) {
							if (BPMNEdges.get(base).getId().contains(i1.getId())) {
								p1 = BPMNEdges.get(base).getWaypoint();
							} else if (BPMNEdges.get(base).getId().contains(i2.getId())) {
								p2 = BPMNEdges.get(base).getWaypoint();
							}
						}

						if ((Float.compare(p1.get(p1.size() - 2).getX(), p2.get(p2.size() - 2).getX()) == 0)
								&& (Float.compare(p1.get(p1.size() - 1).getY(), p2.get(p2.size() - 1).getY()) == 0)
								&& (Float.compare(p1.get(p1.size() - 1).getX(), p2.get(p2.size() - 1).getX()) == 0)) {
							i1 = i2;
						} else {
							num++;
							String name = Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(i2.getId(), IDProcess, name);
							i1 = i2;
						}
					}
				}
			}
		}

		for (Activity ou : mappaO.keySet()) {
			List<DataOutputAssociation> outputs = mappaO.get(ou);
			if (!outputs.isEmpty()) {
				DataOutputAssociation o1 = null;
				for (DataOutputAssociation o2 : outputs) {
					if (o1 == null) {
						o1 = o2;
					} else {
						List<Point> p1 = new ArrayList<Point>();
						List<Point> p2 = new ArrayList<Point>();
						for (BaseElement base : BPMNEdges.keySet()) {
							if (BPMNEdges.get(base).getId().contains(o1.getId())) {
								p1 = BPMNEdges.get(base).getWaypoint();
							} else if (BPMNEdges.get(base).getId().contains(o2.getId())) {
								p2 = BPMNEdges.get(base).getWaypoint();
							}
						}

						if ((Float.compare(p1.get(0).getY(), p2.get(0).getY()) == 0)
								&& (Float.compare(p1.get(0).getX(), p2.get(0).getX()) == 0)
								&& (Float.compare(p1.get(1).getX(), p2.get(1).getX()) == 0)) {
							o1 = o2;
						} else {
							num++;
							String name = Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(o2.getId(), IDProcess, name);
							o1 = o2;
						}
					}
				}
			}
		}
		
		
		if (num == 0) {
			this.status = true;
			this.Suggestion += Messages.getString("OrganizeArtifact.SuggestionOK", l); //$NON-NLS-1$

		} else {
			this.Suggestion += Messages.getString("OrganizeArtifact.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		}
	}

}
