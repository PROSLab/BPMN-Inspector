package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling;

import java.util.Locale;

import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.ExclusiveGateway;
import org.eclipse.bpmn2.SequenceFlow;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SubProcess;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;

public class LabelingXORGateway extends abstractGuideline {

	public LabelingXORGateway(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "34"; //$NON-NLS-1$
		this.Description = Messages.getString("LabelingXORGateway.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("LabelingXORGateway.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {
		StringBuilder temp = new StringBuilder();

		int z = 0;

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
					} else if (fe instanceof ExclusiveGateway) {
						ExclusiveGateway gateway = (ExclusiveGateway) fe;
						boolean bool = ((gateway.getIncoming().size() <= gateway.getOutgoing().size()));
						if (bool) {
							int find = gateway.getName().indexOf("?");
							if (gateway.getName() == null || gateway.getName().length() < 4 || find <0) {
								z++;
								elementsBPMN.add(fe);
								String name = fe.getName() != null ? fe.getName()
										: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(fe.getId(), IDProcess, name);
								temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
										+ "\n"); //$NON-NLS-1$
							}
							String name1 = "";
							for (SequenceFlow sq : gateway.getOutgoing()) {
								if (sq.getName()==null) {
									z++;
									elementsBPMN.add(sq);
									String name = sq.getName() != null ? sq.getName()
											: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
									setElements(sq.getId(), IDProcess, name);
									temp.append("* name=" + name + " ID=" + sq.getId() //$NON-NLS-1$ //$NON-NLS-2$
											+ "\n"); //$NON-NLS-1$
								}
								else {
									if (name1.indexOf(sq.getName())<0) {
										name1 += sq.getName();
									}
									else {
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
						else if (!bool) {
							if (gateway.getName()!=null) {
								z++;
							}
						}
					}
				}
			}
		}
		if (z > 0) {

			this.Suggestion += Messages.getString("LabelingXORGateway.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("LabelingXORGateway.SuggestionOK", l); //$NON-NLS-1$
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
			} else if (fe instanceof ExclusiveGateway) {
				ExclusiveGateway gateway = (ExclusiveGateway) fe;
				boolean bool = ((gateway.getIncoming().size() <= gateway.getOutgoing().size()));
				if (bool)
					if (gateway.getName() == null || (gateway.getName().length() == 0)) {
						// System.out.println(fe.eClass().getName() + ": name="+ fe.getName()!=null?
						// fe.getName() : "Unlabeled" + " ID=" + fe.getId());
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
			this.Suggestion += Messages.getString("LabelingXORGateway.SuggestionSubprocessKO", l) + sub.getName() + " "; //$NON-NLS-1$ //$NON-NLS-2$
			this.status = false;
		}

	}

}
