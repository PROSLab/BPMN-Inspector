package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.eclipse.bpmn2.Activity;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.EndEvent;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Gateway;
import org.eclipse.bpmn2.IntermediateCatchEvent;
import org.eclipse.bpmn2.IntermediateThrowEvent;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.StartEvent;
import org.eclipse.bpmn2.SubProcess;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;

public class ExplicitStartEndEvents extends abstractGuideline {

	public ExplicitStartEndEvents(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "12"; //$NON-NLS-1$
		this.Description = Messages.getString("ExplicitStartEndEvents.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("ExplicitStartEndEvents.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {
		StringBuilder ret = new StringBuilder(""); //$NON-NLS-1$
		boolean flag = true;

		List<StartEvent> starts = new ArrayList<StartEvent>();
		List<EndEvent> ends = new ArrayList<EndEvent>();
		List<SubProcess> subproc = new ArrayList<SubProcess>();
		List<Activity> activities = new ArrayList<Activity>();
		List<Gateway> gateways = new ArrayList<Gateway>();
		List<IntermediateCatchEvent> catches = new ArrayList<IntermediateCatchEvent>();
		List<IntermediateThrowEvent> throwes = new ArrayList<IntermediateThrowEvent>();
		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				// System.out.format("Found a process: %s\n", process.getName());

				IDProcess = process.getId();
				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof SubProcess) {
						SubProcess sub = (SubProcess) fe;
						this.searchSubProcess(sub);
						subproc.add(sub);
					} else if (fe instanceof StartEvent) {
						StartEvent s = (StartEvent) fe;
						starts.add(s);
					} else if (fe instanceof EndEvent) {
						EndEvent e = (EndEvent) fe;
						ends.add(e);
					} else if (fe instanceof Activity) {
						Activity a = (Activity) fe;
						activities.add(a);
					} else if (fe instanceof Gateway) {
						Gateway g = (Gateway) fe;
						gateways.add(g);
					} else if (fe instanceof IntermediateCatchEvent) {
						IntermediateCatchEvent i = (IntermediateCatchEvent) fe;
						catches.add(i);
					} else if (fe instanceof IntermediateThrowEvent) {
						IntermediateThrowEvent i = (IntermediateThrowEvent) fe;
						throwes.add(i);
					}
				}
			}
		}

		if (!starts.isEmpty() && !ends.isEmpty()) {
			for (StartEvent start : starts) {
				if (start.getOutgoing().isEmpty()) {
					flag = false;
				}
			}
			for (EndEvent end : ends) {
				if (end.getIncoming().isEmpty()) {
					flag = false;
				}
			}
			if (!subproc.isEmpty()) {
				for (SubProcess a : subproc) {
					if (a.getIncoming().isEmpty() || a.getOutgoing().isEmpty()) {
						flag = false;
						elementsBPMN.add(a);
						String name = a.getName() != null ? a.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(a.getId(), IDProcess, name);
					}
				}
			}
			if (!activities.isEmpty()) {
				for (Activity a : activities) {
					if (a.getIncoming().isEmpty() || a.getOutgoing().isEmpty()) {
						flag = false;
						elementsBPMN.add(a);
						String name = a.getName() != null ? a.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(a.getId(), IDProcess, name);
					}
				}
			}
			if (!gateways.isEmpty()) {
				for (Gateway g : gateways) {
					if (g.getIncoming().isEmpty() || g.getOutgoing().isEmpty()) {
						flag = false;
						elementsBPMN.add(g);
						String name = g.getName() != null ? g.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(g.getId(), IDProcess, name);
					}
				}
			}
			if (!catches.isEmpty()) {
				for (IntermediateCatchEvent c : catches) {
					if (c.getIncoming().isEmpty() || c.getOutgoing().isEmpty()) {
						flag = false;
						elementsBPMN.add(c);
						String name = c.getName() != null ? c.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(c.getId(), IDProcess, name);
					}
				}
			}
			if (!throwes.isEmpty()) {
				for (IntermediateThrowEvent t : throwes) {
					if (t.getIncoming().isEmpty() || t.getOutgoing().isEmpty()) {
						flag = false;
						elementsBPMN.add(t);
						String name = t.getName() != null ? t.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(t.getId(), IDProcess, name);
					}
				}
			}
		} else {
			flag = false;
		}

		if (flag == true) {
			this.Suggestion += Messages.getString("ExplicitStartEndEvents.SuggestionOK", l); //$NON-NLS-1$
			this.status = true;
		} else {
			this.status = false;
			this.Suggestion += Messages.getString("ExplicitStartEndEvents.SuggestionKO", l); //$NON-NLS-1$
		}
	}

	protected void searchSubProcess(SubProcess sub) {
		boolean flag = true;

		List<StartEvent> starts = new ArrayList<StartEvent>();
		List<EndEvent> ends = new ArrayList<EndEvent>();
		List<SubProcess> subproc = new ArrayList<SubProcess>();
		List<Activity> activities = new ArrayList<Activity>();
		List<Gateway> gateways = new ArrayList<Gateway>();
		List<IntermediateCatchEvent> catches = new ArrayList<IntermediateCatchEvent>();
		List<IntermediateThrowEvent> throwes = new ArrayList<IntermediateThrowEvent>();

		for (FlowElement fe : sub.getFlowElements()) {
			if (fe instanceof StartEvent) {
				StartEvent s = (StartEvent) fe;
				starts.add(s);
			} else if (fe instanceof EndEvent) {
				EndEvent e = (EndEvent) fe;
				ends.add(e);
			} else if (fe instanceof Activity) {
				Activity a = (Activity) fe;
				activities.add(a);
			} else if (fe instanceof Gateway) {
				Gateway g = (Gateway) fe;
				gateways.add(g);
			} else if (fe instanceof IntermediateCatchEvent) {
				IntermediateCatchEvent i = (IntermediateCatchEvent) fe;
				catches.add(i);
			} else if (fe instanceof IntermediateThrowEvent) {
				IntermediateThrowEvent i = (IntermediateThrowEvent) fe;
				throwes.add(i);
			}
		}

		if (!starts.isEmpty() && !ends.isEmpty()) {
			for (StartEvent start : starts) {
				if (start.getOutgoing().isEmpty()) {
					flag = false;
				}
			}
			for (EndEvent end : ends) {
				if (end.getIncoming().isEmpty()) {
					flag = false;
				}
			}
			if (!subproc.isEmpty()) {
				for (SubProcess a : subproc) {
					if (a.getIncoming().isEmpty() || a.getOutgoing().isEmpty()) {
						flag = false;
						elementsBPMN.add(a);
						String name = a.getName() != null ? a.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(a.getId(), IDProcess, name);
					}
				}
			}
			if (!activities.isEmpty()) {
				for (Activity a : activities) {
					if (a.getIncoming().isEmpty() || a.getOutgoing().isEmpty()) {
						flag = false;
						elementsBPMN.add(a);
						String name = a.getName() != null ? a.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(a.getId(), IDProcess, name);
					}
				}
			}
			if (!gateways.isEmpty()) {
				for (Gateway g : gateways) {
					if (g.getIncoming().isEmpty() || g.getOutgoing().isEmpty()) {
						flag = false;
						elementsBPMN.add(g);
						String name = g.getName() != null ? g.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(g.getId(), IDProcess, name);
					}
				}
			}
			if (!catches.isEmpty()) {
				for (IntermediateCatchEvent c : catches) {
					if (c.getIncoming().isEmpty() || c.getOutgoing().isEmpty()) {
						flag = false;
						elementsBPMN.add(c);
						String name = c.getName() != null ? c.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(c.getId(), IDProcess, name);
					}
				}
			}
			if (!throwes.isEmpty()) {
				for (IntermediateThrowEvent t : throwes) {
					if (t.getIncoming().isEmpty() || t.getOutgoing().isEmpty()) {
						flag = false;
						elementsBPMN.add(t);
						String name = t.getName() != null ? t.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(t.getId(), IDProcess, name);
					}
				}
			}
		} else {
			flag = false;
		}

		if (flag == false) {
			this.Suggestion += Messages.getString("ExplicitStartEndEvents.SuggestionKO", l); //$NON-NLS-1$
			this.status = true;
		}
	}
}
