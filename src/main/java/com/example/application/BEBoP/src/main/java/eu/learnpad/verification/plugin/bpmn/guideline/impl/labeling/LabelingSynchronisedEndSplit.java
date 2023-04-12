package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.EndEvent;
import org.eclipse.bpmn2.ExclusiveGateway;
import org.eclipse.bpmn2.SequenceFlow;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SubProcess;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;

public class LabelingSynchronisedEndSplit extends abstractGuideline {

	public LabelingSynchronisedEndSplit(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "38"; //$NON-NLS-1$
		this.Description = Messages.getString("LabelingSynchronisedEndSplit.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("LabelingSynchronisedEndSplit.Name", l); //$NON-NLS-1$

	}

	List<EndEvent> names = new ArrayList<EndEvent>();

	@Override
	protected void findGL(Definitions diagram) {
		StringBuilder temp = new StringBuilder();

		int z = 0;

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;

				IDProcess = process.getId();
				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof SubProcess) {
						SubProcess sub = (SubProcess) fe;
						this.searchSubProcess(sub);
					} else if (fe instanceof ExclusiveGateway) {
						ExclusiveGateway gateway = (ExclusiveGateway) fe;
						boolean bool = ((gateway.getIncoming().size() <= gateway.getOutgoing().size()));
						if (bool) {
							if (!names.isEmpty()) {
								if (gateway.getOutgoing().size() == names.size()) {
									for (SequenceFlow sq : gateway.getOutgoing()) {
										if (sq.getName() != null) {
											for (EndEvent end : names) {
												if (end.getName() != null) {
													if (end.getName().equals(sq.getName())) {
														names.remove(end);
														gateway.getOutgoing().remove(sq);
													} else {
														z++;
														elementsBPMN.add(sq);
														String name = sq.getName() != null ? sq.getName()
																: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
														setElements(sq.getId(), IDProcess, name);
														temp.append("* name=" + name + " ID=" + sq.getId() //$NON-NLS-1$ //$NON-NLS-2$
																+ "\n"); //$NON-NLS-1$
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
			}
		}
		
		if (z > 0) {
			this.Suggestion += Messages.getString("LabelingSynchronisedEndSplit.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("LabelingSynchronisedEndSplit.SuggestionOK", l); //$NON-NLS-1$
		}
	}

	protected void searchSubProcess(SubProcess sub) {

		if (!sub.getFlowElements().isEmpty()) {
			for (FlowElement fe : sub.getFlowElements()) {
				if (fe instanceof SubProcess) {
					SubProcess ssub = (SubProcess) fe;
					this.searchSubProcess(ssub);
				} else if (fe instanceof EndEvent) {
					EndEvent end = (EndEvent) fe;
					names.add(end);
				}
			}
		}
	}
}
