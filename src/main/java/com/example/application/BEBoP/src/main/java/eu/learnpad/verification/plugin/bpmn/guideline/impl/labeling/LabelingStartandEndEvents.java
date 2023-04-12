package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.eclipse.bpmn2.Activity;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.EndEvent;
import org.eclipse.bpmn2.EventDefinition;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.StartEvent;
import org.eclipse.bpmn2.SubProcess;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;

public class LabelingStartandEndEvents extends abstractGuideline {

	public LabelingStartandEndEvents(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "32"; //$NON-NLS-1$
		this.Description = Messages.getString("LabelingStartandEndEvents.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("LabelingStartandEndEvents.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {
		StringBuilder temp = new StringBuilder();

		List<StartEvent> starts = new ArrayList<StartEvent>();
		List<EndEvent> ends = new ArrayList<EndEvent>();
		List<StartEvent> starts2 = new ArrayList<StartEvent>();
		List<EndEvent> ends2 = new ArrayList<EndEvent>();
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
					} else if (fe instanceof StartEvent) {
						StartEvent a = (StartEvent) fe;
						List<EventDefinition> la = a.getEventDefinitions();
						if (la.isEmpty()) {
							starts.add(a);
						}
					} else if (fe instanceof EndEvent) {
						EndEvent a = (EndEvent) fe;
						List<EventDefinition> la = a.getEventDefinitions();
						if (la.isEmpty()) {
							ends.add(a);
						}
					}
				}
			}
		}

		if (starts.size() == 1) {
			if (starts.get(0).getName() != null) {
				if (ends.get(0).getName().length() >= 1) {
					num++;
					elementsBPMN.add(starts.get(0));
					String name = starts.get(0).getName() != null ? starts.get(0).getName()
							: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(starts.get(0).getId(), IDProcess, name);
					temp.append("* name=" + name + " ID=" + starts.get(0).getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "\n"); //$NON-NLS-1$
				}
			}
		} else if (starts.size() > 1) {
			for (StartEvent s : starts) {
				if (s.getName() == null || s.getName().length() < 4) {
					num++;
					elementsBPMN.add(s);
					String name = s.getName() != null ? s.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(s.getId(), IDProcess, name);
					temp.append("* name=" + name + " ID=" + s.getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "\n"); //$NON-NLS-1$
				}
				else {
					starts2.add(s);
				}
			}
		}
		
		if (!starts2.isEmpty()) {
			StartEvent s1 = null;
			for (StartEvent s2 : starts2) {
				if (s1 == null) {
					s1 = s2;
				}
				else {
					if (s1.getName().equals(s2.getName())) {
						num++;
						elementsBPMN.add(s2);
						String name = s2.getName() != null ? s2.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(s2.getId(), IDProcess, name);
						temp.append("* name=" + name + " ID=" + s2.getId() //$NON-NLS-1$ //$NON-NLS-2$
								+ "\n"); //$NON-NLS-1$
						s1 = s2;
					}
					else {
						s1 = s2;
					}
				}
			}
		}
		

		if (ends.size() == 1) {
			if (ends.get(0).getName() != null) {
				if (ends.get(0).getName().length() >= 1) {
					num++;
					elementsBPMN.add(ends.get(0));
					String name = ends.get(0).getName() != null ? ends.get(0).getName()
							: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(ends.get(0).getId(), IDProcess, name);
					temp.append("* name=" + name + " ID=" + ends.get(0).getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "\n"); //$NON-NLS-1$
				}
			}
		} else if (ends.size() > 1) {
			for (EndEvent e : ends) {
				if (e.getName() == null || e.getName().length() < 4) {
					num++;
					elementsBPMN.add(e);
					String name = e.getName() != null ? e.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(e.getId(), IDProcess, name);
					temp.append("* name=" + name + " ID=" + e.getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "\n"); //$NON-NLS-1$
				}
				else {
					ends2.add(e);
				}
			}
		}
		
		if (!ends2.isEmpty()) {
			EndEvent e1 = null;
			for (EndEvent e2 : ends2) {
				if (e1 == null) {
					e1 = e2;
				}
				else {
					if (e1.getName().equals(e2.getName())) {
						num++;
						elementsBPMN.add(e2);
						String name = e2.getName() != null ? e2.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(e2.getId(), IDProcess, name);
						temp.append("* name=" + name + " ID=" + e2.getId() //$NON-NLS-1$ //$NON-NLS-2$
								+ "\n"); //$NON-NLS-1$
						e1 = e2;
					}
					else {
						e1 = e2;
					}
				}
			}
		}

		if (num > 0) {
			this.Suggestion += Messages.getString("LabelingStartandEndEvents.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("LabelingStartandEndEvents.SuggestionOK", l); //$NON-NLS-1$
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
			} else if (fe instanceof StartEvent) {

				StartEvent a = (StartEvent) fe;
				List<EventDefinition> la = a.getEventDefinitions();
				// MessageEventDefinition
				if ((a.getName() == null || (a.getName().length() == 0)) && !la.isEmpty()) {
					// System.out.println(fe.eClass().getName() + ": name="+ fe.getName()!=null?
					// fe.getName() : "Unlabeled" + " ID=" + fe.getId());
					num++;

					elementsBPMN.add(fe);
					String name = fe.getName() != null ? fe.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(fe.getId(), IDProcess, name);
					temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "\n"); //$NON-NLS-1$
				}

			} else if (fe instanceof EndEvent) {
				EndEvent a = (EndEvent) fe;
				List<EventDefinition> la = a.getEventDefinitions();
				// MessageEventDefinition
				if ((a.getName() == null || (a.getName().length() == 0)) && !la.isEmpty()) {
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
			this.Suggestion += Messages.getString("LabelingStartandEndEvents.SuggestionSubprocessKO", l) + sub.getName() //$NON-NLS-1$
					+ " "; //$NON-NLS-1$
			this.status = false;
		}

	}

}
