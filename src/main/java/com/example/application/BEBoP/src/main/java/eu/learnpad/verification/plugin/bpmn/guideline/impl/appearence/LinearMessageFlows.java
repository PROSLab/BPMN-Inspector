package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.appearence;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.eclipse.bpmn2.BaseElement;
import org.eclipse.bpmn2.Collaboration;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.MessageFlow;
import org.eclipse.bpmn2.Participant;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.di.BPMNEdge;
import org.eclipse.dd.dc.Point;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.reader.BPMNUtils;

public class LinearMessageFlows extends abstractGuideline {

	public LinearMessageFlows(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "46"; //$NON-NLS-1$
		this.Description = Messages.getString("LinearMessageFlows.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("LinearMessageFlows.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {

		int num = 0;
		Map<BaseElement, BPMNEdge> BPMNEdges = BPMNUtils.getAllBPMNEdge(diagram);
		List<MessageFlow> edge = BPMNUtils.getAllMessageFlow(diagram);
		
		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Collaboration) {
				Collaboration collaboration = (Collaboration) rootElement;
				// List<MessageFlow> msgFlow = collaboration.getMessageFlows();
				List<Participant> participants = collaboration.getParticipants();
				for (Participant participant : participants) {
					IDProcess = participant.getProcessRef().getId();
				}
				if (collaboration.getMessageFlows() != null || !collaboration.getMessageFlows().isEmpty()) {
					edge.addAll(collaboration.getMessageFlows());
				}
			}
		}

		if (edge != null) {
			for (MessageFlow mf : edge) {
				for (BaseElement be : BPMNEdges.keySet()) {
					if (BPMNEdges.get(be).getId().contains(mf.getId())) {
						List<Point> pointMsg = BPMNEdges.get(be).getWaypoint();
						if (!pointMsg.isEmpty()) {
							if (pointMsg.size() > 4) {
								num++;
								String name = mf.getName() != null ? mf.getName()
										: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(mf.getId(), IDProcess, name);
							} else {
								Point point = null;
								for (Point p1 : pointMsg) {
									if (point == null) {
										point = p1;
									} else {
										if (Float.compare(Math.abs(point.getX() - p1.getX()), 1) <= 0
												|| Float.compare(Math.abs(point.getY() - p1.getY()), 1) <= 0) {
											point = p1;
										} else {
											num++;
											String name = mf.getName() != null ? mf.getName()
													: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
											setElements(mf.getId(), IDProcess, name);
											point = p1;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		
		if (num > 0) {

			this.Suggestion += Messages.getString("LinearMessageFlows.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("LinearMessageFlows.SuggestionOK", l); //$NON-NLS-1$
		}
	}
}