package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.EndEvent;
import org.eclipse.bpmn2.EventDefinition;
import org.eclipse.bpmn2.MessageEventDefinition;
import org.eclipse.bpmn2.ErrorEventDefinition;
import org.eclipse.bpmn2.CancelEventDefinition;
import org.eclipse.bpmn2.CompensateEventDefinition;
import org.eclipse.bpmn2.EscalationEventDefinition;
import org.eclipse.bpmn2.SignalEventDefinition;
import org.eclipse.bpmn2.TerminateEventDefinition;
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
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.utils.ElementID;

public class ConsistentUsageEndEvents extends abstractGuideline {

	public ConsistentUsageEndEvents(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "14"; //$NON-NLS-1$
		this.Description = Messages.getString("ConsistentUsageEndEvents.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("ConsistentUsageEndEvents.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {
		StringBuilder temp = new StringBuilder();

		Map<Process, Collection<FlowElement>> hashProcessFlow = new HashMap<Process, Collection<FlowElement>>();
		// List<ElementID> Elementstemp = new ArrayList<ElementID>();
		List<ElementID> Messagetemp = new ArrayList<ElementID>();
		List<ElementID> Errortemp = new ArrayList<ElementID>();
		List<ElementID> Canceltemp = new ArrayList<ElementID>();
		List<ElementID> Signaltemp = new ArrayList<ElementID>();
		List<ElementID> Compensatetemp = new ArrayList<ElementID>();
		List<ElementID> Escalationtemp = new ArrayList<ElementID>();
		List<ElementID> Terminatetemp = new ArrayList<ElementID>();
		List<ElementID> Endtemp = new ArrayList<ElementID>();
		List<ElementID> Multipletemp = new ArrayList<ElementID>();

		Collection<FlowElement> messageEventtemp = new ArrayList<FlowElement>();
		Collection<FlowElement> errorEventtemp = new ArrayList<FlowElement>();
		Collection<FlowElement> endEventtemp = new ArrayList<FlowElement>();
		Collection<FlowElement> cancelEventtemp = new ArrayList<FlowElement>();
		Collection<FlowElement> compensateEventtemp = new ArrayList<FlowElement>();
		Collection<FlowElement> signalEventtemp = new ArrayList<FlowElement>();
		Collection<FlowElement> escalationEventtemp = new ArrayList<FlowElement>();
		Collection<FlowElement> terminateEventtemp = new ArrayList<FlowElement>();
		Collection<FlowElement> multipleEventtemp = new ArrayList<FlowElement>();

		boolean flag = false;

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Process) {
				// Collection<FlowElement> elementsBPMNtemp = new ArrayList<FlowElement>();
				Process process = (Process) rootElement;
				// hashProcessFlow.put(process, elementsBPMNtemp);
				hashProcessFlow.put(process, messageEventtemp);
				hashProcessFlow.put(process, errorEventtemp);
				// System.out.format("Found a process: %s\n", process.getName());
				int num = 0;
				IDProcess = process.getId();
				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof SubProcess) {
						SubProcess sub = (SubProcess) fe;
						// System.out.format("Found a SubProcess: %s\n", sub.getName());
						// this.searchSubProcess(sub);
					} else if (fe instanceof EndEvent) {
						/**
						 * num++; elementsBPMNtemp.add(fe); String name = fe.getName()!=null?
						 * fe.getName() : Messages.getString("Generic.LabelEmpty",l); //$NON-NLS-1$
						 * Elementstemp.add(new ElementID(fe.getId(),IDProcess,name));
						 * temp.append("Name=" +name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$ +
						 * "; "); //$NON-NLS-1$
						 * 
						 * }
						 */

						EndEvent e = (EndEvent) fe;
						List<EventDefinition> edef = e.getEventDefinitions();
						if (!e.getEventDefinitions().isEmpty()) {
							if (e.getEventDefinitions().size() == 1) {
								for (EventDefinition eventDefinition : edef) {
									if (eventDefinition instanceof MessageEventDefinition) {
										num++;
										messageEventtemp.add(fe);
										String name = fe.getName() != null ? fe.getName()
												: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
										Messagetemp.add(new ElementID(fe.getId(), IDProcess, name));
										temp.append("Name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
												+ "; "); //$NON-NLS-1$

									} else if (eventDefinition instanceof ErrorEventDefinition) {
										num++;
										errorEventtemp.add(fe);
										String name = fe.getName() != null ? fe.getName()
												: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
										Errortemp.add(new ElementID(fe.getId(), IDProcess, name));
										temp.append("Name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
												+ "; "); //$NON-NLS-1$

									} else if (eventDefinition instanceof EscalationEventDefinition) {
										num++;
										escalationEventtemp.add(fe);
										String name = fe.getName() != null ? fe.getName()
												: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
										Escalationtemp.add(new ElementID(fe.getId(), IDProcess, name));
										temp.append("Name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
												+ "; "); //$NON-NLS-1$

									} else if (eventDefinition instanceof CompensateEventDefinition) {
										num++;
										compensateEventtemp.add(fe);
										String name = fe.getName() != null ? fe.getName()
												: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
										Compensatetemp.add(new ElementID(fe.getId(), IDProcess, name));
										temp.append("Name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
												+ "; "); //$NON-NLS-1$

									} else if (eventDefinition instanceof SignalEventDefinition) {
										num++;
										signalEventtemp.add(fe);
										String name = fe.getName() != null ? fe.getName()
												: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
										Signaltemp.add(new ElementID(fe.getId(), IDProcess, name));
										temp.append("Name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
												+ "; "); //$NON-NLS-1$

									} else if (eventDefinition instanceof CancelEventDefinition) {
										num++;
										cancelEventtemp.add(fe);
										String name = fe.getName() != null ? fe.getName()
												: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
										Canceltemp.add(new ElementID(fe.getId(), IDProcess, name));
										temp.append("Name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
												+ "; "); //$NON-NLS-1$

									} else if (eventDefinition instanceof TerminateEventDefinition) {
										num++;
										terminateEventtemp.add(fe);
										String name = fe.getName() != null ? fe.getName()
												: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
										Terminatetemp.add(new ElementID(fe.getId(), IDProcess, name));
										temp.append("Name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
												+ "; "); //$NON-NLS-1$

									}
								}

							} else {
								num++;
								multipleEventtemp.add(fe);
								String name = fe.getName() != null ? fe.getName()
										: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
								Multipletemp.add(new ElementID(fe.getId(), IDProcess, name));
								temp.append("Name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
										+ "; "); //$NON-NLS-1$
							}
						} else {
							num++;
							endEventtemp.add(fe);
							String name = fe.getName() != null ? fe.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							Endtemp.add(new ElementID(fe.getId(), IDProcess, name));
							temp.append("Name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
									+ "; "); //$NON-NLS-1$

						}
					}
				}
			}
		}
		// ArrayList<FlowElement> elementsBPMNres = new ArrayList<FlowElement>();
		// Collection<ElementID> Elementsres = new ArrayList<ElementID>();
		ArrayList<FlowElement> messageEventres = new ArrayList<FlowElement>();
		ArrayList<FlowElement> errorEventres = new ArrayList<FlowElement>();
		ArrayList<FlowElement> cancelEventres = new ArrayList<FlowElement>();
		ArrayList<FlowElement> endEventres = new ArrayList<FlowElement>();
		ArrayList<FlowElement> compensateEventres = new ArrayList<FlowElement>();
		ArrayList<FlowElement> escalationEventres = new ArrayList<FlowElement>();
		ArrayList<FlowElement> signalEventres = new ArrayList<FlowElement>();
		ArrayList<FlowElement> terminateEventres = new ArrayList<FlowElement>();
		ArrayList<FlowElement> multipleEventres = new ArrayList<FlowElement>();

		Collection<ElementID> Messageres = new ArrayList<ElementID>();
		Collection<ElementID> Errorres = new ArrayList<ElementID>();
		Collection<ElementID> Cancelres = new ArrayList<ElementID>();
		Collection<ElementID> Escalationres = new ArrayList<ElementID>();
		Collection<ElementID> Compensateres = new ArrayList<ElementID>();
		Collection<ElementID> Signalres = new ArrayList<ElementID>();
		Collection<ElementID> Endres = new ArrayList<ElementID>();
		Collection<ElementID> Terminateres = new ArrayList<ElementID>();
		Collection<ElementID> Multipleres = new ArrayList<ElementID>();

		/**
		 * for(Collection<FlowElement> elementsBPMNtemp: hashProcessFlow.values()){
		 * if(elementsBPMNtemp.size()>1){ Collection<FlowElement> removeBPMNtemps = new
		 * ArrayList<FlowElement>(); int z = 0; for( FlowElement e :elementsBPMNtemp){
		 * boolean flags = false; String name = e.getName(); if(name==null) name =
		 * getName(e);
		 * 
		 * for( FlowElement ee :elementsBPMNtemp){ if(!ee.equals(e)){ String namee =
		 * ee.getName(); if(namee==null) namee = getName(ee); if(namee!=null &
		 * name!=null) { if(name.equals(namee)){ flags = true; } }else{ if(name==namee){
		 * flags=true; } }
		 * 
		 * }
		 * 
		 * } if(flags){ elementsBPMNres.add(e); Elementsres.add(Elementstemp.get(z)); }
		 * z++; } } }
		 */

		if (messageEventtemp.size() > 1) {
			Collection<FlowElement> removeMessagetemps = new ArrayList<FlowElement>();
			int z = 0;
			for (FlowElement e : messageEventtemp) {
				boolean flags = false;
				String name = e.getName();
				if (name == null)
					name = getName(e);

				for (FlowElement ee : messageEventtemp) {
					if (!ee.equals(e)) {
						String namee = ee.getName();
						if (namee == null)
							namee = getName(ee);
						if (namee != null & name != null) {
							if (name.equals(namee)) {
								flags = true;
							}
						} else {
							if (name == namee) {
								flags = true;
							}
						}

					}

				}
				if (flags) {
					messageEventres.add(e);
					Messageres.add(Messagetemp.get(z));
				}
				z++;
			}
		}

		if (errorEventtemp.size() > 1) {
			Collection<FlowElement> removeErrortemps = new ArrayList<FlowElement>();
			int z = 0;
			for (FlowElement e : errorEventtemp) {
				boolean flags = false;
				String name = e.getName();
				if (name == null)
					name = getName(e);

				for (FlowElement ee : errorEventtemp) {
					if (!ee.equals(e)) {
						String namee = ee.getName();
						if (namee == null)
							namee = getName(ee);
						if (namee != null & name != null) {
							if (name.equals(namee)) {
								flags = true;
							}
						} else {
							if (name == namee) {
								flags = true;
							}
						}

					}

				}
				if (flags) {
					errorEventres.add(e);
					Errorres.add(Errortemp.get(z));
				}
				z++;
			}
		}

		if (cancelEventtemp.size() > 1) {
			Collection<FlowElement> removeCanceltemps = new ArrayList<FlowElement>();
			int z = 0;
			for (FlowElement e : cancelEventtemp) {
				boolean flags = false;
				String name = e.getName();
				if (name == null)
					name = getName(e);

				for (FlowElement ee : cancelEventtemp) {
					if (!ee.equals(e)) {
						String namee = ee.getName();
						if (namee == null)
							namee = getName(ee);
						if (namee != null & name != null) {
							if (name.equals(namee)) {
								flags = true;
							}
						} else {
							if (name == namee) {
								flags = true;
							}
						}

					}

				}
				if (flags) {
					cancelEventres.add(e);
					Cancelres.add(Canceltemp.get(z));
				}
				z++;
			}
		}

		if (endEventtemp.size() > 1) {
			Collection<FlowElement> removeEndtemps = new ArrayList<FlowElement>();
			int z = 0;
			for (FlowElement e : endEventtemp) {
				boolean flags = false;
				String name = e.getName();
				if (name == null)
					name = getName(e);

				for (FlowElement ee : endEventtemp) {
					if (!ee.equals(e)) {
						String namee = ee.getName();
						if (namee == null)
							namee = getName(ee);
						if (namee != null & name != null) {
							if (name.equals(namee)) {
								flags = true;
							}
						} else {
							if (name == namee) {
								flags = true;
							}
						}

					}

				}
				if (flags) {
					endEventres.add(e);
					Endres.add(Endtemp.get(z));
				}
				z++;
			}
		}

		if (escalationEventtemp.size() > 1) {
			Collection<FlowElement> removeEscalationtemps = new ArrayList<FlowElement>();
			int z = 0;
			for (FlowElement e : escalationEventtemp) {
				boolean flags = false;
				String name = e.getName();
				if (name == null)
					name = getName(e);

				for (FlowElement ee : escalationEventtemp) {
					if (!ee.equals(e)) {
						String namee = ee.getName();
						if (namee == null)
							namee = getName(ee);
						if (namee != null & name != null) {
							if (name.equals(namee)) {
								flags = true;
							}
						} else {
							if (name == namee) {
								flags = true;
							}
						}

					}

				}
				if (flags) {
					escalationEventres.add(e);
					Escalationres.add(Escalationtemp.get(z));
				}
				z++;
			}
		}

		if (compensateEventtemp.size() > 1) {
			Collection<FlowElement> removeCompensatetemps = new ArrayList<FlowElement>();
			int z = 0;
			for (FlowElement e : compensateEventtemp) {
				boolean flags = false;
				String name = e.getName();
				if (name == null)
					name = getName(e);

				for (FlowElement ee : compensateEventtemp) {
					if (!ee.equals(e)) {
						String namee = ee.getName();
						if (namee == null)
							namee = getName(ee);
						if (namee != null & name != null) {
							if (name.equals(namee)) {
								flags = true;
							}
						} else {
							if (name == namee) {
								flags = true;
							}
						}

					}

				}
				if (flags) {
					compensateEventres.add(e);
					Compensateres.add(Compensatetemp.get(z));
				}
				z++;
			}
		}

		if (signalEventtemp.size() > 1) {
			Collection<FlowElement> removeSignaltemps = new ArrayList<FlowElement>();
			int z = 0;
			for (FlowElement e : signalEventtemp) {
				boolean flags = false;
				String name = e.getName();
				if (name == null)
					name = getName(e);

				for (FlowElement ee : signalEventtemp) {
					if (!ee.equals(e)) {
						String namee = ee.getName();
						if (namee == null)
							namee = getName(ee);
						if (namee != null & name != null) {
							if (name.equals(namee)) {
								flags = true;
							}
						} else {
							if (name == namee) {
								flags = true;
							}
						}

					}

				}
				if (flags) {
					signalEventres.add(e);
					Signalres.add(Signaltemp.get(z));
				}
				z++;
			}
		}

		if (terminateEventtemp.size() > 1) {
			Collection<FlowElement> removeTerminatetemps = new ArrayList<FlowElement>();
			int z = 0;
			for (FlowElement e : terminateEventtemp) {
				boolean flags = false;
				String name = e.getName();
				if (name == null)
					name = getName(e);

				for (FlowElement ee : terminateEventtemp) {
					if (!ee.equals(e)) {
						String namee = ee.getName();
						if (namee == null)
							namee = getName(ee);
						if (namee != null & name != null) {
							if (name.equals(namee)) {
								flags = true;
							}
						} else {
							if (name == namee) {
								flags = true;
							}
						}

					}

				}
				if (flags) {
					terminateEventres.add(e);
					Terminateres.add(Terminatetemp.get(z));
				}
				z++;
			}
		}

		if (multipleEventtemp.size() > 1) {
			Collection<FlowElement> removeMultipletemps = new ArrayList<FlowElement>();
			int z = 0;
			for (FlowElement e : multipleEventtemp) {
				boolean flags = false;
				String name = e.getName();
				if (name == null)
					name = getName(e);

				for (FlowElement ee : multipleEventtemp) {
					if (!ee.equals(e)) {
						String namee = ee.getName();
						if (namee == null)
							namee = getName(ee);
						if (namee != null & name != null) {
							if (name.equals(namee)) {
								flags = true;
							}
						} else {
							if (name == namee) {
								flags = true;
							}
						}

					}

				}
				if (flags) {
					multipleEventres.add(e);
					Multipleres.add(Multipletemp.get(z));
				}
				z++;
			}
		}

		boolean res = true;

		if (messageEventres.size() > 1) {
			elementsBPMN.addAll(messageEventres);
			setAllElements(Messageres);
			res = false;
		}
		if (errorEventres.size() > 1) {
			elementsBPMN.addAll(errorEventres);
			setAllElements(Errorres);
			res = false;
		}
		if (endEventres.size() > 1) {
			elementsBPMN.addAll(endEventres);
			setAllElements(Endres);
			res = false;
		}
		if (cancelEventres.size() > 1) {
			elementsBPMN.addAll(cancelEventres);
			setAllElements(Cancelres);
			res = false;
		}
		if (escalationEventres.size() > 1) {
			elementsBPMN.addAll(escalationEventres);
			setAllElements(Escalationres);
			res = false;
		}
		if (compensateEventres.size() > 1) {
			elementsBPMN.addAll(compensateEventres);
			setAllElements(Compensateres);
			res = false;
		}
		if (signalEventres.size() > 1) {
			elementsBPMN.addAll(signalEventres);
			setAllElements(Signalres);
			res = false;
		}
		if (terminateEventres.size() > 1) {
			elementsBPMN.addAll(terminateEventres);
			setAllElements(Terminateres);
			res = false;
		}

		if (multipleEventres.size() > 1) {
			elementsBPMN.addAll(multipleEventres);
			setAllElements(Multipleres);
			res = false;
		}

		if (!res) {
			this.Suggestion += Messages.getString("ConsistentUsageEndEvents.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("ConsistentUsageEndEvents.SuggestionOK", l); //$NON-NLS-1$
		}
	}

	protected void searchSubProcess(SubProcess sub) {
		StringBuilder temp = new StringBuilder();
		Collection<FlowElement> elementsBPMNtemp = new ArrayList<FlowElement>();
		Collection<ElementID> Elementstemp = new ArrayList<ElementID>();
		int num = 0;
		for (FlowElement fe : sub.getFlowElements()) {
			if (fe instanceof SubProcess) {
				SubProcess ssub = (SubProcess) fe;
				// System.out.format("Found a SubProcess: %s\n", ssub.getName());
				this.searchSubProcess(ssub);
			} else if (fe instanceof EndEvent) {

				// System.out.println(fe.eClass().getName() + ": name="+ fe.getName() + " ID=" +
				// fe.getId());
				num++;

				elementsBPMNtemp.add(fe);

				String name = fe.getName() != null ? fe.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
				Elementstemp.add(new ElementID(fe.getId(), IDProcess, name));
				temp.append(" Name=" + name + " ID=" + fe.getId() //$NON-NLS-1$ //$NON-NLS-2$
						+ "; "); //$NON-NLS-1$

			}
		}
		if (num > 1) {
			elementsBPMN.addAll(elementsBPMNtemp);
			setAllElements(Elementstemp);
			this.Suggestion += Messages.getString("ConsistentUsageEndEvents.SuggestionSubprocessKO", l) + sub.getName() //$NON-NLS-1$
					+ " "; //$NON-NLS-1$
			this.status = false;
		}

	}

	public String getName(FlowElement fe) {
		List<ExtensionAttributeValue> Listed = fe.getExtensionValues();
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
						return descrpt;
						/*
						 * if(descrpt.equals("without name")){ flag=true; }
						 */
					}
					// System.out.println();
				}

			}

		}
		return null;
	}

}