package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling;

import java.util.List;
import java.util.Locale;

import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.IntermediateCatchEvent;
import org.eclipse.bpmn2.IntermediateThrowEvent;
import org.eclipse.bpmn2.StartEvent;
import org.eclipse.bpmn2.EndEvent;
import org.eclipse.bpmn2.EventDefinition;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SubProcess;
import org.eclipse.bpmn2.TerminateEventDefinition;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;

public class LabelingEvents extends abstractGuideline {

	public LabelingEvents(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "31"; //$NON-NLS-1$
		this.Description = Messages.getString("LabelingEvents.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("LabelingEvents.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {
		StringBuilder temp = new StringBuilder();

		int num = 0;

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				// System.out.format("Found a process: %s\n", process.getName());

				IDProcess = process.getId();
				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof SubProcess) {
						SubProcess sub = (SubProcess) fe;
						// System.out.format("Found a SubProcess: %s\n", sub.getName());
						this.searchSubProcess(sub);
					} else if (fe instanceof IntermediateCatchEvent) {
						IntermediateCatchEvent a = (IntermediateCatchEvent) fe;
						if (a.getName() == null || a.getName().length() < 4) {
							num++;

							elementsBPMN.add(fe);
							String name = fe.getName() != null ? fe.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(fe.getId(), IDProcess, name);
							temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
									+ "\n"); //$NON-NLS-1$

						}

					} else if (fe instanceof IntermediateThrowEvent) {
						IntermediateThrowEvent a = (IntermediateThrowEvent) fe;
						if (a.getName() == null || a.getName().length() < 4) {
							num++;

							elementsBPMN.add(fe);
							String name = fe.getName() != null ? fe.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(fe.getId(), IDProcess, name);
							temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
									+ "\n"); //$NON-NLS-1$

						}

					} else if (fe instanceof StartEvent) {
						StartEvent s = (StartEvent) fe;
						List<EventDefinition> la = s.getEventDefinitions();
						if ((s.getName() == null || s.getName().length() < 4) && !la.isEmpty()) {
							num++;
							elementsBPMN.add(s);
							String name = s.getName() != null ? s.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(s.getId(), IDProcess, name);
							temp.append("* name=" + name + " ID=" + s.getId() //$NON-NLS-1$ //$NON-NLS-2$
									+ "\n"); //$NON-NLS-1$
						}
					} else if (fe instanceof EndEvent) {
						EndEvent e = (EndEvent) fe;
						List<EventDefinition> la = e.getEventDefinitions();
						if (!la.isEmpty()) {
							for (EventDefinition eventDefinition : la) {
								if (!(eventDefinition instanceof TerminateEventDefinition)) {
									if (e.getName() == null || e.getName().length() < 3) {
										num++;
										elementsBPMN.add(e);
										String name = e.getName() != null ? e.getName()
												: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
										setElements(e.getId(), IDProcess, name);
										temp.append("* name=" + name + " ID=" + e.getId() //$NON-NLS-1$ //$NON-NLS-2$
												+ "\n"); //$NON-NLS-1$
									}
								}
							}
						}
					}
				}
			}
		}
		if (num > 0) {

			this.Suggestion += Messages.getString("LabelingEvents.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("LabelingEvents.SuggestionOK", l); //$NON-NLS-1$
		}
	}

	protected void searchSubProcess(SubProcess sub) {
		StringBuilder temp = new StringBuilder();

		int num = 0;
		for (FlowElement fe : sub.getFlowElements()) {
			if (fe instanceof SubProcess) {
				SubProcess ssub = (SubProcess) fe;
				// System.out.format("Found a SubProcess: %s\n", ssub.getName());
				this.searchSubProcess(ssub);
			} else if (fe instanceof IntermediateCatchEvent) {

				IntermediateCatchEvent a = (IntermediateCatchEvent) fe;
				if (a.getName() == null || (a.getName().length() == 0)) {
					// System.out.println(fe.eClass().getName() + ": name="+ fe.getName()!=null?
					// fe.getName() : "Unlabeled" + " ID=" + fe.getId());
					num++;

					elementsBPMN.add(fe);
					String name = fe.getName() != null ? fe.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(fe.getId(), IDProcess, name);
					temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "\n"); //$NON-NLS-1$
				}

			} else if (fe instanceof IntermediateThrowEvent) {
				IntermediateThrowEvent a = (IntermediateThrowEvent) fe;
				if (a.getName() == null || (a.getName().length() == 0)) {
					num++;

					elementsBPMN.add(fe);
					String name = fe.getName() != null ? fe.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(fe.getId(), IDProcess, name);
					temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "\n"); //$NON-NLS-1$

				}

			}
		}
		if (num > 0) {
			this.Suggestion += Messages.getString("LabelingEvents.SuggestionSubProcessKO", l) + sub.getName() + " "; //$NON-NLS-1$ //$NON-NLS-2$
			this.status = false;
		}

	}

}
