package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl;

import java.util.List;
import java.util.Locale;

import org.eclipse.bpmn2.Activity;
import org.eclipse.bpmn2.AdHocSubProcess;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.ParallelGateway;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SubProcess;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;

public class MinimizeConcurrency extends abstractGuideline {

	public MinimizeConcurrency(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "6"; //$NON-NLS-1$
		this.Description = Messages.getString("MinimizeConcurrency.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("MinimizeConcurrency.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {
		StringBuilder temp = new StringBuilder();
		
		int num = 0;

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				IDProcess = process.getId();
				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof SubProcess) {
						SubProcess sub = (SubProcess) fe;
						if (sub instanceof AdHocSubProcess) {
							num++;
							elementsBPMN.add(sub);
							String name = sub.getName() != null ? sub.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(sub.getId(), IDProcess, name);
							temp.append("* name=" + name + " ID=" + sub.getId() //$NON-NLS-1$ //$NON-NLS-2$
									+ "\n"); //$NON-NLS-1$
						}
					} else if (fe instanceof ParallelGateway) {
						ParallelGateway gateway = (ParallelGateway) fe;
						boolean bool = ((gateway.getIncoming().size() <= gateway.getOutgoing().size()));
						if (bool) {
							num++;
							elementsBPMN.add(gateway);
							String name = gateway.getName() != null ? gateway.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(gateway.getId(), IDProcess, name);
							temp.append("* name=" + name + " ID=" + gateway.getId() //$NON-NLS-1$ //$NON-NLS-2$
									+ "\n"); //$NON-NLS-1$
						}
					} else if (fe instanceof Activity) {
						Activity activity = (Activity) fe;
						if (activity.getOutgoing().size()>1) {
							num++;
							elementsBPMN.add(activity);
							String name = activity.getName() != null ? activity.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(activity.getId(), IDProcess, name);
							temp.append("* name=" + name + " ID=" + activity.getId() //$NON-NLS-1$ //$NON-NLS-2$
									+ "\n"); //$NON-NLS-1$
						}
					}
				}
			}
		}

		
		
		if (num > 0) {
			this.Suggestion += Messages.getString("MinimizeConcurrency.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("MinimizeConcurrency.SuggestionOK", l); //$NON-NLS-1$
		}
	}

}
