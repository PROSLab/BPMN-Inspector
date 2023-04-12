package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.appearence;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.eclipse.bpmn2.Activity;
import org.eclipse.bpmn2.DataInputAssociation;
import org.eclipse.bpmn2.DataObjectReference;
import org.eclipse.bpmn2.DataOutputAssociation;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SubProcess;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;

public class AssociateDataObject extends abstractGuideline {

	public AssociateDataObject(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "49"; //$NON-NLS-1$
		this.Description = Messages.getString("AssociateDataObject.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("AssociateDataObject.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {

		int num = 0;

		List<FlowElement> activities = new ArrayList<FlowElement>();
		List<DataObjectReference> dataRef = new ArrayList<DataObjectReference>();

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				IDProcess = process.getId();
				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof SubProcess) {
						SubProcess sub = (SubProcess) fe;
						activities.add(sub);
					} else if (fe instanceof Activity) {
						Activity a = (Activity) fe;
						activities.add(a);
					} else if (fe instanceof DataObjectReference) {
						DataObjectReference d = (DataObjectReference) fe;
						dataRef.add(d);
					}
				}
			}
		}

		List<DataObjectReference> dataOk = new ArrayList<DataObjectReference>();
		if (!dataRef.isEmpty() && !activities.isEmpty()) {
			for (DataObjectReference data : dataRef) {
				for (FlowElement fe : activities) {
					if (fe instanceof Activity) {
						Activity a = (Activity) fe;
						if (a.getDataInputAssociations() != null) {
							List<DataInputAssociation> input = a.getDataInputAssociations();
							for (DataInputAssociation i : input) {
								if (i.getSourceRef().contains(data)) {
									dataOk.add(data);
								}
							}
						}
						if (a.getDataOutputAssociations() != null) {
							List<DataOutputAssociation> output = a.getDataOutputAssociations();
							for (DataOutputAssociation o : output) {
								if (o.getTargetRef().equals(data)) {
									dataOk.add(data);
								}
							}
						}
					} else if (fe instanceof SubProcess) {
						SubProcess sub = (SubProcess) fe;
						if (sub.getDataInputAssociations() != null) {
							List<DataInputAssociation> input = sub.getDataInputAssociations();
							for (DataInputAssociation i : input) {
								if (i.getSourceRef().contains(data)) {
									dataOk.add(data);
								}
							}
						}
						if (sub.getDataOutputAssociations() != null) {
							List<DataOutputAssociation> output = sub.getDataOutputAssociations();
							for (DataOutputAssociation o : output) {
								if (o.getTargetRef().equals(data)) {
									dataOk.add(data);
								}
							}
						}
					}
				}
			}
		}

		if (dataRef.size() != dataOk.size()) {
			for (DataObjectReference d1 : dataRef) {
				if (!dataOk.contains(d1)) {
					num++;
					elementsBPMN.add(d1);
					String name = d1.getName() != null ? d1.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(d1.getId(), IDProcess, name);
				}
			}
		}

		if (num > 0) {
			this.Suggestion += Messages.getString("AssociateDataObject.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("AssociateDataObject.SuggestionOK", l); //$NON-NLS-1$

		}
	}

}
