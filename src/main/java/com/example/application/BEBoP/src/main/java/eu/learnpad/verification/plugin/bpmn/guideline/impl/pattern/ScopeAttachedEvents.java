package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.pattern;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.eclipse.bpmn2.Activity;
import org.eclipse.bpmn2.BoundaryEvent;
import org.eclipse.bpmn2.CancelEventDefinition;
import org.eclipse.bpmn2.ConditionalEventDefinition;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.EndEvent;
import org.eclipse.bpmn2.ErrorEventDefinition;
import org.eclipse.bpmn2.EscalationEventDefinition;
import org.eclipse.bpmn2.EventDefinition;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.MessageEventDefinition;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SignalEventDefinition;
import org.eclipse.bpmn2.SubProcess;
import org.eclipse.bpmn2.TimerEventDefinition;
import org.eclipse.bpmn2.CompensateEventDefinition;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;

public class ScopeAttachedEvents extends abstractGuideline {

	public ScopeAttachedEvents(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "42"; //$NON-NLS-1$
		this.Description = Messages.getString("ScopeAttachedEvents.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("ScopeAttachedEvents.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {

		int num = 0;
		List<BoundaryEvent> boundary = new ArrayList<BoundaryEvent>();
		List<BoundaryEvent> messageb = new ArrayList<BoundaryEvent>();
		List<BoundaryEvent> timerb = new ArrayList<BoundaryEvent>();
		List<BoundaryEvent> escalationb = new ArrayList<BoundaryEvent>();
		List<BoundaryEvent> conditionalb = new ArrayList<BoundaryEvent>();
		List<BoundaryEvent> errorb = new ArrayList<BoundaryEvent>();
		List<BoundaryEvent> cancelb = new ArrayList<BoundaryEvent>();
		List<BoundaryEvent> compb = new ArrayList<BoundaryEvent>();
		List<BoundaryEvent> signalb = new ArrayList<BoundaryEvent>();
		List<BoundaryEvent> multipleb = new ArrayList<BoundaryEvent>();
		List<Activity> activities = new ArrayList<Activity>();

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				IDProcess = process.getId();

				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof BoundaryEvent) {
						BoundaryEvent bound = (BoundaryEvent) fe;
						boundary.add(bound);
					} else if (fe instanceof Activity) {
						Activity a = (Activity) fe;
						activities.add(a);
					}
				}
			}
		}

		if (boundary != null) {
			for (BoundaryEvent bound : boundary) {
				List<EventDefinition> def = bound.getEventDefinitions();
				if (!def.isEmpty()) {
					if (def.size() == 1) {
						for (EventDefinition d : def) {
							if (d instanceof MessageEventDefinition) {
								messageb.add(bound);
							} else if (d instanceof TimerEventDefinition) {
								timerb.add(bound);
							} else if (d instanceof EscalationEventDefinition) {
								escalationb.add(bound);
							} else if (d instanceof ConditionalEventDefinition) {
								conditionalb.add(bound);
							} else if (d instanceof ErrorEventDefinition) {
								errorb.add(bound);
							} else if (d instanceof CancelEventDefinition) {
								cancelb.add(bound);
							} else if (d instanceof CompensateEventDefinition) {
								compb.add(bound);
							} else if (d instanceof SignalEventDefinition) {
								signalb.add(bound);
							}
						}
					} else {
						multipleb.add(bound);
					}
				}
			}
		}

		if (messageb.size() > 1) {
			BoundaryEvent b1 = null;
			for (BoundaryEvent b2 : messageb) {
				if (b1 == null) {
					b1 = b2;
				} else {
					if (sameException(b1, b2, activities)) {
						num++;
						elementsBPMN.add(b2);
						String name = b2.getName() != null ? b2.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(b2.getId(), IDProcess, name);
						b1 = b2;
					} else {
						b1 = b2;
					}
				}
			}
		}

		if (timerb.size() > 1) {
			BoundaryEvent b1 = null;
			for (BoundaryEvent b2 : timerb) {
				if (b1 == null) {
					b1 = b2;
				} else {
					if (sameException(b1, b2, activities)) {
						num++;
						elementsBPMN.add(b2);
						String name = b2.getName() != null ? b2.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(b2.getId(), IDProcess, name);
						b1 = b2;
					} else {
						b1 = b2;
					}
				}
			}
		}
		if (escalationb.size() > 1) {
			BoundaryEvent b1 = null;
			for (BoundaryEvent b2 : escalationb) {
				if (b1 == null) {
					b1 = b2;
				} else {
					if (sameException(b1, b2, activities)) {
						num++;
						elementsBPMN.add(b2);
						String name = b2.getName() != null ? b2.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(b2.getId(), IDProcess, name);
						b1 = b2;
					} else {
						b1 = b2;
					}
				}
			}
		}
		if (conditionalb.size() > 1) {
			BoundaryEvent b1 = null;
			for (BoundaryEvent b2 : conditionalb) {
				if (b1 == null) {
					b1 = b2;
				} else {
					if (sameException(b1, b2, activities)) {
						num++;
						elementsBPMN.add(b2);
						String name = b2.getName() != null ? b2.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(b2.getId(), IDProcess, name);
						b1 = b2;
					} else {
						b1 = b2;
					}
				}
			}
		}
		if (errorb.size() > 1) {
			BoundaryEvent b1 = null;
			for (BoundaryEvent b2 : errorb) {
				if (b1 == null) {
					b1 = b2;
				} else {
					if (sameException(b1, b2, activities)) {
						num++;
						elementsBPMN.add(b2);
						String name = b2.getName() != null ? b2.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(b2.getId(), IDProcess, name);
						b1 = b2;
					} else {
						b1 = b2;
					}
				}
			}
		}
		if (cancelb.size() > 1) {
			BoundaryEvent b1 = null;
			for (BoundaryEvent b2 : cancelb) {
				if (b1 == null) {
					b1 = b2;
				} else {
					if (sameException(b1, b2, activities)) {
						num++;
						elementsBPMN.add(b2);
						String name = b2.getName() != null ? b2.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(b2.getId(), IDProcess, name);
						b1 = b2;
					} else {
						b1 = b2;
					}
				}
			}
		}
		if (compb.size() > 1) {
			BoundaryEvent b1 = null;
			for (BoundaryEvent b2 : compb) {
				if (b1 == null) {
					b1 = b2;
				} else {
					if (sameException(b1, b2, activities)) {
						num++;
						elementsBPMN.add(b2);
						String name = b2.getName() != null ? b2.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(b2.getId(), IDProcess, name);
						b1 = b2;
					} else {
						b1 = b2;
					}
				}
			}
		}
		if (signalb.size() > 1) {
			BoundaryEvent b1 = null;
			for (BoundaryEvent b2 : signalb) {
				if (b1 == null) {
					b1 = b2;
				} else {
					if (sameException(b1, b2, activities)) {
						num++;
						elementsBPMN.add(b2);
						String name = b2.getName() != null ? b2.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(b2.getId(), IDProcess, name);
						b1 = b2;
					} else {
						b1 = b2;
					}
				}
			}
		}
		if (multipleb.size() > 1) {
			BoundaryEvent b1 = null;
			for (BoundaryEvent b2 : multipleb) {
				if (b1 == null) {
					b1 = b2;
				} else {
					if (sameException(b1, b2, activities)) {
						num++;
						elementsBPMN.add(b2);
						String name = b2.getName() != null ? b2.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(b2.getId(), IDProcess, name);
						b1 = b2;
					} else {
						b1 = b2;
					}
				}
			}
		}

		if (num > 0) {
			this.Suggestion += Messages.getString("ScopeAttachedEvents.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("ScopeAttachedEvents.SuggestionOK", l); //$NON-NLS-1$
		}
	}

	private boolean sameException(BoundaryEvent b1, BoundaryEvent b2, List<Activity> activities) {
		String name1 = null;
		String name2 = null;
		if (!activities.isEmpty()) {
			for (Activity a : activities) {
				if (b1.getOutgoing().equals(a.getIncoming())) {
					if (a.getName() != null) {
						name1 = a.getName();
					}
				} else if (b2.getOutgoing().equals(a.getIncoming())) {
					if (a.getName() != null) {
						name2 = a.getName();
					}
				}

			}
			if (name1 == null && name2 == null) {
				return true;
			} else {
				if (name1.equals(name2)) {
					return true;
				}
			}
		}
		return false;
	}

}
