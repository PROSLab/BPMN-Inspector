package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.appearence;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.eclipse.bpmn2.BaseElement;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SequenceFlow;
import org.eclipse.bpmn2.di.BPMNEdge;
import org.eclipse.dd.dc.Point;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.reader.BPMNUtils;

public class LinearSequenceFlows extends abstractGuideline {

	public LinearSequenceFlows(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "45"; //$NON-NLS-1$
		this.Description = Messages.getString("LinearSequenceFlows.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("LinearSequenceFlows.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {

		int num = 0;
		Map<BaseElement, BPMNEdge> BPMNEdges = BPMNUtils.getAllBPMNEdge(diagram);

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				IDProcess = process.getId();
				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof SequenceFlow) {
						SequenceFlow sq = (SequenceFlow) fe;
						for (BaseElement be : BPMNEdges.keySet()) {
							if (BPMNEdges.get(be).getId().contains(sq.getId())) {
								List<Point> points = BPMNEdges.get(be).getWaypoint();
								if (points.size() > 4) {
									num++;
									String name = sq.getName() != null ? sq.getName()
											: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
									setElements(sq.getId(), IDProcess, name);
								} else {
									Point point = null;
									for (Point p1 : points) {
										if (point == null) {
											point = p1;
										} else {
											if (Float.compare(Math.abs(point.getX() - p1.getX()), 1) <= 0
													|| Float.compare(Math.abs(point.getY() - p1.getY()), 1) <= 0) {
												point = p1;
											} else {
												num++;
												String name = sq.getName() != null ? sq.getName()
														: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
												setElements(sq.getId(), IDProcess, name);
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
		}

		if (num > 0) {

			this.Suggestion += Messages.getString("LinearSequenceFlows.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("LinearSequenceFlows.SeggestionOK", l); //$NON-NLS-1$
		}
	}

}