package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.eclipse.bpmn2.Activity;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.Documentation;
import org.eclipse.bpmn2.ExtensionAttributeValue;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SubProcess;
import org.eclipse.emf.ecore.util.FeatureMap;
import org.eclipse.emf.ecore.util.FeatureMap.Entry;
import org.eclipse.emf.ecore.xml.type.AnyType;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;

public class ActivityDescription extends abstractGuideline {

	public ActivityDescription(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "8"; //$NON-NLS-1$
		this.Description = Messages.getString("ActivityDescription.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("ActivityDescription.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {
		StringBuilder temp = new StringBuilder();

		int num = 0;
		List<FlowElement> activities = new ArrayList<FlowElement>();

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				// System.out.format("Found a process: %s\n", process.getName());

				IDProcess = process.getId();
				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof SubProcess) {
						SubProcess sub = (SubProcess) fe;
						activities.add(sub);
						this.searchSubProcess(sub);
					} else if (fe instanceof Activity) {
						Activity a = (Activity) fe;
						activities.add(a);
					}
				}
			}
		}

		if (!activities.isEmpty()) {
			for (FlowElement fel : activities) {
				boolean flag = false;
				List<Documentation> doc = fel.getDocumentation();
				try {
					List<ExtensionAttributeValue> Listed = fel.getExtensionValues();
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
								if (nameex.getValue().equals("Description")) {
									String descrpt = objt.getMixed().get(0).getValue().toString();
									if (descrpt.length() > 4) {
										flag = true;
									}
								}
							}
						}
					}
				} catch (Exception e) {
					// TODO:
				}
				if (doc.isEmpty() && !flag) {
					num++;

					elementsBPMN.add(fel);

					String name = fel.getName() != null ? fel.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(fel.getId(), IDProcess, name);
					temp.append("* name=" + name + " ID=" + fel.getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "\n"); //$NON-NLS-1$

				}
			}
		}
		if (num > 0) {

			this.Suggestion += Messages.getString("ActivityDescription.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("ActivityDescription.SuggestionOK", l); //$NON-NLS-1$
		}
	}

	protected void searchSubProcess(SubProcess sub) {

		List<FlowElement> activities = new ArrayList<FlowElement>();
		int num = 0;
		for (FlowElement fe : sub.getFlowElements()) {
			if (fe instanceof SubProcess) {
				SubProcess ssub = (SubProcess) fe;
				activities.add(ssub);
				this.searchSubProcess(ssub);
			} else if (fe instanceof Activity) {
				Activity a = (Activity) fe;
				activities.add(a);
			}
		}

		if (!activities.isEmpty()) {
			for (FlowElement fel : activities) {
				List<Documentation> doc = fel.getDocumentation();
				if (doc.isEmpty()) {
					num++;

					elementsBPMN.add(fel);
					String name = fel.getName() != null ? fel.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(fel.getId(), IDProcess, name);
				}
			}
		}
		
		if (num > 0) {
			this.Suggestion += Messages.getString("ActivityDescription.SuggestionSubprocessKO", l) + sub.getName(); //$NON-NLS-1$
			this.status = false;
		}
	}
}
