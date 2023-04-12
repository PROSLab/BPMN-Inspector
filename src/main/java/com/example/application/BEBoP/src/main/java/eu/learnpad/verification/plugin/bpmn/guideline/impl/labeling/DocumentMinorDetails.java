package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.eclipse.bpmn2.Activity;
import org.eclipse.bpmn2.Artifact;
import org.eclipse.bpmn2.Association;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.TextAnnotation;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;

public class DocumentMinorDetails extends abstractGuideline {

	public DocumentMinorDetails(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "26"; //$NON-NLS-1$
		this.Description = Messages.getString("DocumentMinorDetails.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("DocumentMinorDetails.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {
		StringBuilder temp = new StringBuilder();

		boolean res = true;
		int z = 0;

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				IDProcess = process.getId();

				for (FlowElement fe : process.getFlowElements()) {
					int num = 0;
					
					if (process.getArtifacts() != null && !process.getArtifacts().isEmpty()) {
						for (Artifact artifact : process.getArtifacts()) {
						
							if (artifact instanceof Association) {
								Association asso = (Association) artifact;
								if (asso.getSourceRef() != null && asso.getTargetRef() != null) {
									String source = asso.getSourceRef().toString();
									String target = asso.getTargetRef().toString();
									int starts = source.length();
									int startf = target.length();
									String ids = source.substring(source.indexOf("#") + 1, starts - 1); //$NON-NLS-1$
									String idt = target.substring(target.indexOf("#") + 1, startf - 1); //$NON-NLS-1$

									boolean flag = (fe.getId().equals(ids) || fe.getId().equals(idt));

									boolean flag2 = asso.getSourceRef().equals(fe) || asso.getTargetRef().equals(fe);
									
									if ((flag || flag2)) {
										num++;
										for (Artifact a2 : process.getArtifacts()) {
											if (a2 instanceof TextAnnotation) {
												TextAnnotation textA = (TextAnnotation) a2;
												boolean flag3 = (textA.getId().equals(ids) || textA.getId().equals(idt));

												boolean flag4 = asso.getSourceRef().equals(textA) || asso.getTargetRef().equals(textA);
												if ((flag3 || flag4)) {
													if (textA.getText() == null || textA.getText().isEmpty()) {
														z++;
														String name = Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
														setElements(textA.getId(), IDProcess, name);
														temp.append("* name=" + name + " ID=" + textA.getId() //$NON-NLS-1$ //$NON-NLS-2$
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
					if (num > 1) {
						res = false;
						elementsBPMN.add(fe);
						String name = fe.getName() != null ? fe.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(fe.getId(), IDProcess, name);
						temp.append("* name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
								+ "\n"); //$NON-NLS-1$
					}
				}
			}
		}
		if (res == true && z == 0) {
			this.status = true;
			this.Suggestion += Messages.getString("DocumentMinorDetails.SuggestionOK", l); //$NON-NLS-1$
		} else {
			this.Suggestion += Messages.getString("DocumentMinorDetails.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		}
	}

}
