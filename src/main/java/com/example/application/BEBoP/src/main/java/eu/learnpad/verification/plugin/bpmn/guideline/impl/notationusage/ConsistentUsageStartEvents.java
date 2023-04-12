package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Locale;

import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.StartEvent;
import org.eclipse.bpmn2.SubProcess;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.utils.ElementID;

public class ConsistentUsageStartEvents extends abstractGuideline {

	public ConsistentUsageStartEvents(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "13"; //$NON-NLS-1$
		this.Description = Messages.getString("ConsistentUsageStartEvents.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("ConsistentUsageStartEvents.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {
		StringBuilder temp = new StringBuilder();
		Collection<FlowElement> elementsBPMNtemp = new ArrayList<FlowElement>();
		Collection<ElementID> Elementstemp = new ArrayList<ElementID>();

		boolean flag = false;

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				// System.out.format("Found a process: %s\n", process.getName());
				int num = 0;
				IDProcess = process.getId();
				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof SubProcess) {
						SubProcess sub = (SubProcess) fe;
						// System.out.format("Found a SubProcess: %s\n", sub.getName());
						this.searchSubProcess(sub);
					} else if (fe instanceof StartEvent) {

						num++;

						/*
						 * elementsBPMN.add(fe); setElements(fe.getId(),IDProcess); ret.append(i++
						 * +") name=" + fe.getName() + " ID=" + fe.getId() + "\n");
						 */

						elementsBPMNtemp.add(fe);
						String name = fe.getName() != null ? fe.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						Elementstemp.add(new ElementID(fe.getId(), IDProcess, name));
						temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
								+ "\n"); //$NON-NLS-1$

					}
				}
				if (num > 1) {
					flag = true;
				} else {
					elementsBPMNtemp = new ArrayList<FlowElement>();
					Elementstemp = new ArrayList<ElementID>();
				}
			}
		}
		if (flag) {
			elementsBPMN.addAll(elementsBPMNtemp);
			setAllElements(Elementstemp);
			this.Suggestion += Messages.getString("ConsistentUsageStartEvents.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("ConsistentUsageStartEvents.SuggestionOK", l); //$NON-NLS-1$
		}
	}

	protected void searchSubProcess(SubProcess sub) {
		StringBuilder temp = new StringBuilder();
		Collection<FlowElement> elementsBPMNtemp = new ArrayList<FlowElement>();
		Collection<ElementID> Elementstemp = new ArrayList<ElementID>();
		int num = 0;
		for (FlowElement fe : sub.getFlowElements()) {
			if (fe instanceof SubProcess) {
				SubProcess ssub = (SubProcess) fe;
				// System.out.format("Found a SubProcess: %s\n", ssub.getName());
				this.searchSubProcess(ssub);
			} else if (fe instanceof StartEvent) {

				// System.out.println(fe.eClass().getName() + ": name="+ fe.getName() + " ID=" +
				// fe.getId());
				num++;

				elementsBPMNtemp.add(fe);
				String name = fe.getName() != null ? fe.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
				Elementstemp.add(new ElementID(fe.getId(), IDProcess, name));
				temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
						+ "\n"); //$NON-NLS-1$

			}
		}
		if (num > 1) {
			elementsBPMN.addAll(elementsBPMNtemp);
			setAllElements(Elementstemp);
			this.Suggestion += Messages.getString("ConsistentUsageStartEvents.SuggestionSubProcessKO", l) //$NON-NLS-1$
					+ sub.getName() + " "; //$NON-NLS-1$
			this.status = false;
		}

	}

}
