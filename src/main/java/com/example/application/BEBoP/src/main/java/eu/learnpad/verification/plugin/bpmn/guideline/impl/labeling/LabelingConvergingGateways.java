package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling;

import java.util.List;
import java.util.Locale;

import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.ExtensionAttributeValue;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Gateway;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SubProcess;
import org.eclipse.emf.ecore.util.FeatureMap;
import org.eclipse.emf.ecore.util.FeatureMap.Entry;
import org.eclipse.emf.ecore.xml.type.AnyType;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;

public class LabelingConvergingGateways extends abstractGuideline {

	public LabelingConvergingGateways(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "36"; //$NON-NLS-1$
		this.Description = Messages.getString("LabelingConvergingGateways.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("LabelingConvergingGateways.Name", l); //$NON-NLS-1$

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
					} else if (fe instanceof Gateway) {
						Gateway gateway = (Gateway) fe;
						boolean bool = ((gateway.getIncoming().size() > 1 & gateway.getOutgoing().size() == 1));
						boolean flag = false;
						try {
							List<ExtensionAttributeValue> Listed = gateway.getExtensionValues();
							for (ExtensionAttributeValue ed : Listed) {
								FeatureMap val = ed.getValue();
								for (int d = 0; d < val.size(); d++) {
									Entry elem = val.get(d);
									AnyType obj = (AnyType) elem.getValue();
									FeatureMap any = obj.getAny();
									for (int s = 0; s < any.size(); s++) {
										Entry entry = any.get(s);
										entry.getValue();
										AnyType objt = (AnyType) entry.getValue();
										FeatureMap anyt = objt.getAnyAttribute();
										Entry nameex = anyt.get(0);
										if (nameex.getValue().equals("Show name")) {
											String descrpt = objt.getMixed().get(0).getValue().toString();
											if (descrpt.equals("do not show")) {
												flag = true;
											}
										}
										// System.out.println();
									}

								}

							}
						} catch (Exception e) {
							// TODO:
						}
						if (bool)
							if (gateway.getName() != null && !flag) {
								if (gateway.getName().length() >= 1) {
									num++;

									elementsBPMN.add(fe);
									String name = fe.getName() != null ? fe.getName()
											: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
									setElements(fe.getId(), IDProcess, name);
									temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
											+ "\n"); //$NON-NLS-1$

								}
							}
					}
				}
			}
		}
		if (num > 0) {

			this.Suggestion += Messages.getString("LabelingConvergingGateways.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("LabelingConvergingGateways.SuggestionOK", l); //$NON-NLS-1$
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
			} else if (fe instanceof Gateway) {
				Gateway gateway = (Gateway) fe;
				boolean bool = ((gateway.getIncoming().size() > 1 & gateway.getOutgoing().size() == 1));
				boolean flag = false;
				try {
					List<ExtensionAttributeValue> Listed = gateway.getExtensionValues();
					for (ExtensionAttributeValue ed : Listed) {
						FeatureMap val = ed.getValue();
						for (int d = 0; d < val.size(); d++) {
							Entry elem = val.get(d);
							AnyType obj = (AnyType) elem.getValue();
							FeatureMap any = obj.getAny();
							for (int s = 0; s < any.size(); s++) {
								Entry entry = any.get(s);
								entry.getValue();
								AnyType objt = (AnyType) entry.getValue();
								FeatureMap anyt = objt.getAnyAttribute();
								Entry nameex = anyt.get(0);
								if (nameex.getValue().equals("Representation")) {
									String descrpt = objt.getMixed().get(0).getValue().toString();
									if (descrpt.equals("without name")) {
										flag = true;
									}
								}
								// System.out.println();
							}

						}

					}
				} catch (Exception e) {
					// TODO:
				}
				if (bool)
					if (gateway.getName() != null && !flag) {
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
			this.Suggestion += Messages.getString("LabelingConvergingGateways.SuggestionSubprocessKO", l) //$NON-NLS-1$
					+ sub.getName() + " "; //$NON-NLS-1$
			this.status = false;
		}

	}

}
