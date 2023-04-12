package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling;

import java.util.ArrayList;
import java.util.Locale;

import org.eclipse.bpmn2.DataObject;
import org.eclipse.bpmn2.DataObjectReference;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SubProcess;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;

public class LabelingDataObject extends abstractGuideline {

	public LabelingDataObject(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "37"; //$NON-NLS-1$
		this.Description = Messages.getString("LabelingDataObject.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("LabelingDataObject.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {
		StringBuilder temp = new StringBuilder();

		int num = 0;
		int z = 0;
		ArrayList<FlowElement> labels = new ArrayList<FlowElement>();

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
					} else if (fe instanceof DataObjectReference) {
						DataObjectReference data = (DataObjectReference) fe;
						DataObject dataO = data.getDataObjectRef();
						if ((data.getName() == null || data.getName().length() < 4)
								&& (dataO.getName() == null || dataO.getName().length() < 4)) {
							num++;
							elementsBPMN.add(fe);
							String name = fe.getName() != null ? fe.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(fe.getId(), IDProcess, name);
							temp.append("* name=" + name + " ID=" + dataO.getId() //$NON-NLS-1$ //$NON-NLS-2$
									+ "\n"); //$NON-NLS-1$
						} else {
							labels.add(data.getName() == null ? dataO : data);
						}
					}

					if (labels.size() > 1) {
						for (FlowElement name1 : labels) {
							labels.remove(name1);
							for (FlowElement name2 : labels) {
								if (!name1.equals(name2)) {
									if (name1.getName().contains(name2.getName())
											|| name2.getName().contains(name1.getName())) {
										boolean firstContainsSecond, secondContainsFirst = false;
										firstContainsSecond = name1.getName().contains("[")
												&& name1.getName().contains("]");
										secondContainsFirst = name2.getName().contains("[")
												&& name2.getName().contains("]");
										if (secondContainsFirst || firstContainsSecond) {
											
										} else {
											z++;
											elementsBPMN.add(name2);
											String name = name2.getName() != null ? name2.getName()
													: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
											setElements(name2.getId(), IDProcess, name);
											temp.append("* name=" + name + " ID=" + name2.getId() //$NON-NLS-1$ //$NON-NLS-2$
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

		if (num == 0 && z == 0) {
			this.status = true;
			this.Suggestion += Messages.getString("LabelingDataObject.SuggestionOK", l); //$NON-NLS-1$

		} else {
			this.Suggestion += Messages.getString("LabelingDataObject.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
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
			} else if (fe instanceof DataObject) {

				DataObject data = (DataObject) fe;
				if (data.getName() == null || (data.getName().length() == 0)) {

					elementsBPMN.add(fe);
					String name = fe.getName() != null ? fe.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(fe.getId(), IDProcess, name);
					temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "\n"); //$NON-NLS-1$
				}

			}
		}
		if (num > 0) {
			this.Suggestion += Messages.getString("LabelingDataObject.SuggestionSubprocessKO", l) + sub.getName() + " "; //$NON-NLS-1$ //$NON-NLS-2$
			this.status = false;
		}

	}

}