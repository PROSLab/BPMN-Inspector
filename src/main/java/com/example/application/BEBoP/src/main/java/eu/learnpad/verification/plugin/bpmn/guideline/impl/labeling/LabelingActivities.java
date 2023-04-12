package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.eclipse.bpmn2.Activity;
import org.eclipse.bpmn2.CallActivity;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SubProcess;
import org.eclipse.bpmn2.di.BPMNShape;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.reader.BPMNUtils;

public class LabelingActivities extends abstractGuideline {

	public LabelingActivities(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "30"; //$NON-NLS-1$
		this.Description = Messages.getString("LabelingActivities.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("LabelingActivities.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {
		StringBuilder temp = new StringBuilder();

		int num = 0;
		List<FlowElement> activities = new ArrayList<FlowElement>();
		boolean flag = true;

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				// System.out.format("Found a process: %s\n", process.getName());

				IDProcess = process.getId();
				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof SubProcess) {
						SubProcess sub = (SubProcess) fe;
						if (sub.getName() == null || sub.getName().length() < 4) {
							num++;
							elementsBPMN.add(fe);
							String name = fe.getName() != null ? fe.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(fe.getId(), IDProcess, name);
							temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
									+ "\n"); //$NON-NLS-1$
							this.searchSubProcess(sub);
						} else {
							activities.add(sub);
							this.searchSubProcess(sub);
						}

					} else if (fe instanceof CallActivity) {
						CallActivity ca = (CallActivity) fe;
						if (ca.getName() == null || ca.getName().length() < 4) {
							num++;
							elementsBPMN.add(fe);
							String name = fe.getName() != null ? fe.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(fe.getId(), IDProcess, name);
							temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
									+ "\n"); //$NON-NLS-1$
						}
					} else if (fe instanceof Activity) {
						Activity a = (Activity) fe;
						if (a.getName() == null || a.getName().length() < 4) {
							num++;
							elementsBPMN.add(fe);
							String name = fe.getName() != null ? fe.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(fe.getId(), IDProcess, name);
							temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
									+ "\n"); //$NON-NLS-1$

						} else {
							activities.add(a);
						}
					}
				}
			}
		}

		FlowElement a1 = null;
		for (FlowElement a2 : activities) {
			if (a1 == null) {
				a1 = a2;
			} else {
				if (a1.getName().equals(a2.getName())) {
					flag = false;
					elementsBPMN.add(a2);
					String name = a2.getName() != null ? a2.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(a2.getId(), IDProcess, name);
					temp.append("* name=" + name + " ID=" + a2.getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "\n"); //$NON-NLS-1$
					a1 = a2;
				} else {
					a1 = a2;
				}
			}
		}

		if (num == 0 && flag == true) {
			this.status = true;
			this.Suggestion += Messages.getString("LabelingActivities.SuggestionOK", l); //$NON-NLS-1$

		} else {
			this.Suggestion += Messages.getString("LabelingActivities.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		}
	}

	protected void searchSubProcess(SubProcess sub) {
		StringBuilder temp = new StringBuilder();
		List<FlowElement> activities = new ArrayList<FlowElement>();
		int num = 0;
		boolean flag = true;
		
		for (FlowElement fe : sub.getFlowElements()) {
			if (fe instanceof SubProcess) {
				SubProcess ssub = (SubProcess) fe;
				if (ssub.getName() == null || ssub.getName().length() < 4) {
					num++;
					elementsBPMN.add(fe);
					String name = fe.getName() != null ? fe.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(fe.getId(), IDProcess, name);
					temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "\n"); //$NON-NLS-1$
					this.searchSubProcess(sub);
				} else {
					activities.add(ssub);
					this.searchSubProcess(ssub);
				}

			} else if (fe instanceof CallActivity) {
				CallActivity ca = (CallActivity) fe;
				if (ca.getName() == null || ca.getName().length() < 4) {
					num++;
					elementsBPMN.add(fe);
					String name = fe.getName() != null ? fe.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(fe.getId(), IDProcess, name);
					temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "\n"); //$NON-NLS-1$
				}
			} else if (fe instanceof Activity) {
				Activity a = (Activity) fe;
				if (a.getName() == null || a.getName().length() < 4) {
					num++;
					elementsBPMN.add(fe);
					String name = fe.getName() != null ? fe.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(fe.getId(), IDProcess, name);
					temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "\n"); //$NON-NLS-1$

				} else {
					activities.add(a);
				}
			}
		}

		FlowElement a1 = null;
		for (FlowElement a2 : activities) {
			if (a1 == null) {
				a1 = a2;
			} else {
				if (a1.getName().equals(a2.getName())) {
					flag = false;
					elementsBPMN.add(a2);
					String name = a2.getName() != null ? a2.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(a2.getId(), IDProcess, name);
					temp.append("* name=" + name + " ID=" + a2.getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "\n"); //$NON-NLS-1$
					a1 = a2;
				} else {
					a1 = a2;
				}
			}
		}

		if (num > 0 || flag == false) {
			this.Suggestion += Messages.getString("LabelingActivities.SuggestionSubprocessKO", l) + sub.getName(); //$NON-NLS-1$
			this.status = false;
		}
	}
}
