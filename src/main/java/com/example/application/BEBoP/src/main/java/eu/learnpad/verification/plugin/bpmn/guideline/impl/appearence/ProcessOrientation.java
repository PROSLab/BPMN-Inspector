package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.appearence;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.eclipse.bpmn2.BaseElement;
import org.eclipse.bpmn2.Collaboration;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Participant;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SequenceFlow;
import org.eclipse.bpmn2.di.BPMNEdge;
import org.eclipse.bpmn2.di.BPMNShape;
import org.eclipse.dd.dc.Point;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.reader.BPMNUtils;

public class ProcessOrientation extends abstractGuideline {

	public ProcessOrientation(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "47"; //$NON-NLS-1$
		this.Description = Messages.getString("ProcessOrientation.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("ProcessOrientation.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {

		int num = 0;
		int z = 0;
		float x = 0;
		float y = 0;
		Map<BaseElement, BPMNEdge> BPMNEdges = BPMNUtils.getAllBPMNEdge(diagram);

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Collaboration) {
				Collaboration collaboration = (Collaboration) rootElement;

				List<Participant> partecipants = collaboration.getParticipants();
				for (Participant participant : partecipants) {
					participant.getId();
					if (participant.getProcessRef() == null)
						continue;
					IDProcess = participant.getProcessRef().getId();
					BPMNShape shape = BPMNUtils.findBPMNShape(diagram, participant);

					if (shape != null)
						if (!shape.isIsHorizontal()) {
							if (shape.getBounds().getHeight() > shape.getBounds().getWidth()) {
								num++;
								String name = participant.getName() != null ? participant.getName()
										: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(participant.getId(), IDProcess, name);
								// temp.append("Name=" +name + " ID=" + participant.getId()
								// + "; ");
							}
						}
				}
			}

			// CONTROLLO PER VERIFICARE CHE IL PROCESSO SIA ORIZZONTALE
			for (RootElement rootElem : diagram.getRootElements()) {
				if (rootElem instanceof Process) {
					Process process = (Process) rootElem;
					IDProcess = process.getId();
					for (FlowElement fe : process.getFlowElements()) {
						if (fe instanceof SequenceFlow) {
							for (BaseElement be : BPMNEdges.keySet()) {
								BPMNEdge bpmnEdge = BPMNEdges.get(be);
								if (bpmnEdge != null && bpmnEdge.getId() != null && bpmnEdge.getId().contains(fe.getId())) {
									List<Point> points = bpmnEdge.getWaypoint();
									if (points.size() == 2) {
										Point point = null;
										for (Point p1 : points) {
											if (point == null) {
												point = p1;
											} else {
												x += Math.abs(p1.getX() - point.getX());
												y += Math.abs(p1.getY() - point.getY());
												point = p1;
											}
										}
										if (Float.compare(y, x) >= 0) {
											z++;
											String name = fe.getName() != null ? fe.getName()
													: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
											setElements(fe.getId(), IDProcess, name);
										}
									}
								}
							}
						}
					}
				}
			}
		}

			if (num == 0 && z == 0) {
			this.status = true;
			this.Suggestion += Messages.getString("ProcessOrientation.SuggestionOK", l); //$NON-NLS-1$

		} else {
			this.Suggestion += Messages.getString("ProcessOrientation.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		}
	}

}
