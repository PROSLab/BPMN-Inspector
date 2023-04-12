package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.labeling;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.eclipse.bpmn2.Collaboration;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.EndEvent;
import org.eclipse.bpmn2.Event;
import org.eclipse.bpmn2.IntermediateThrowEvent;
import org.eclipse.bpmn2.Message;
import org.eclipse.bpmn2.IntermediateCatchEvent;
import org.eclipse.bpmn2.EventDefinition;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.MessageEventDefinition;
import org.eclipse.bpmn2.MessageFlow;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.StartEvent;
import org.eclipse.bpmn2.SubProcess;
import org.eclipse.bpmn2.impl.InteractionNodeImpl;
import org.eclipse.bpmn2.impl.MessageImpl;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.reader.BPMNUtils;

public class LabelingMessageEvent extends abstractGuideline {

	public LabelingMessageEvent(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "33"; //$NON-NLS-1$
		this.Description = Messages.getString("LabelingMessageEvent.Decription", l); //$NON-NLS-1$
		this.Name = Messages.getString("LabelingMessageEvent.Name", l); //$NON-NLS-1$

	}

	private boolean searchMessageFlow(Event e, List<MessageFlow> msgFlow, List<Message> messages) {

		if (msgFlow != null)
			for (MessageFlow messflow : msgFlow) {
				if (messflow.getSourceRef() instanceof InteractionNodeImpl) {
					InteractionNodeImpl source = (InteractionNodeImpl) messflow.getSourceRef();
					InteractionNodeImpl target = (InteractionNodeImpl) messflow.getTargetRef();
					String fragments = source.eProxyURI().fragment();
					String fragmentt = target.eProxyURI().fragment();
					String eid = e.getId();
					if (eid.equals(fragmentt) || eid.equals(fragments)) {
						if ((messages == null || messages.isEmpty()) && messflow.getMessageRef() == null) {
							return true;
						} else {
							if (messflow.getMessageRef() instanceof MessageImpl) {
								MessageImpl icon = (MessageImpl) messflow.getMessageRef();
								String fragmenti = icon.eProxyURI().fragment();
								for (Message m : messages) {
									String mId = m.getId();
									if (mId.equals(fragmenti)) {
										String nameI = m.getName();
										String nameE = e.getName();
										if (nameI != null) {
											if (nameI.contains(nameE)) {
												return true;
											}
										}
									}
								}
							}
						}
					} else {
						if (messflow.getSourceRef() instanceof Event) {
							if (e.equals(messflow.getSourceRef()) || e.equals(messflow.getTargetRef())) {
								if ((messages == null || messages.isEmpty()) && messflow.getMessageRef() == null) {
									return true;
								} else {
									if (messflow.getMessageRef() instanceof MessageImpl) {
										MessageImpl icon = (MessageImpl) messflow.getMessageRef();
										String fragmenti = icon.eProxyURI().fragment();
										for (Message m : messages) {
											String mId = m.getId();
											if (mId.equals(fragmenti)) {
												String nameI = m.getName();
												String nameE = e.getName();
												if (nameI != null) {
													if (nameI.contains(nameE)) {
														return true;
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		return false;
	}

	@Override
	protected void findGL(Definitions diagram) {

		int num = 0;
		List<MessageFlow> msgFlow = BPMNUtils.getAllMessageFlow(diagram);
		List<Message> messages = new ArrayList<Message>();
		boolean flage = true;

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Message) {
				Message msg = (Message) rootElement;
				messages.add(msg);
			} else if (rootElement instanceof Collaboration) {
				Collaboration collaboration = (Collaboration) rootElement;
				if (collaboration.getMessageFlows() != null || !collaboration.getMessageFlows().isEmpty()) {
					msgFlow.addAll(collaboration.getMessageFlows());
				}
			} else if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				IDProcess = process.getId();
				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof SubProcess) {
						SubProcess sub = (SubProcess) fe;
						this.searchSubProcess(sub);
					}
					if (fe instanceof StartEvent) {
						boolean flags1 = true;
						boolean flags2 = true;
						StartEvent s = (StartEvent) fe;
						List<EventDefinition> def = s.getEventDefinitions();
						for (EventDefinition eventDefinition : def) {
							if (eventDefinition instanceof MessageEventDefinition) {
								if (s.getName() == null || s.getName().length() < 4) {
									flags1 &= false;
								}
								flags2 = searchMessageFlow(s, msgFlow, messages);
							}
						}
						flage = flags1 && flags2;
						if (flage == false) {
							num++;
							elementsBPMN.add(s);
							String name = s.getName() != null ? s.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(s.getId(), IDProcess, name);
						}
					} else if (fe instanceof IntermediateCatchEvent) {
						boolean flagc1 = true;
						boolean flagc2 = true;
						IntermediateCatchEvent i = (IntermediateCatchEvent) fe;
						List<EventDefinition> def = i.getEventDefinitions();
						for (EventDefinition eventDefinition : def) {
							if (eventDefinition instanceof MessageEventDefinition) {
								if (i.getName() == null || i.getName().length() < 4) {
									flagc1 &= false;
								}
								flagc2 = searchMessageFlow(i, msgFlow, messages);
							}
						}
						flage = flagc1 && flagc2;
						if (flage == false) {
							num++;
							elementsBPMN.add(i);
							String name = i.getName() != null ? i.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(i.getId(), IDProcess, name);
						}
					} else if (fe instanceof IntermediateThrowEvent) {
						boolean flagt1 = true;
						boolean flagt2 = true;
						IntermediateThrowEvent i = (IntermediateThrowEvent) fe;
						List<EventDefinition> def = i.getEventDefinitions();
						for (EventDefinition eventDefinition : def) {
							if (eventDefinition instanceof MessageEventDefinition) {
								if (i.getName() == null || i.getName().length() < 4) {
									flagt1 &= false;
								}
								flagt2 = searchMessageFlow(i, msgFlow, messages);
							}
						}
						flage = flagt1 && flagt2;
						if (flage == false) {
							num++;
							elementsBPMN.add(i);
							String name = i.getName() != null ? i.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(i.getId(), IDProcess, name);
						}
					} else if (fe instanceof EndEvent) {
						boolean flage1 = true;
						boolean flage2 = true;
						EndEvent e = (EndEvent) fe;
						List<EventDefinition> def = e.getEventDefinitions();
						for (EventDefinition eventDefinition : def) {
							if (eventDefinition instanceof MessageEventDefinition) {
								if (e.getName() == null || e.getName().length() < 4) {
									flage1 &= false;
								}
								flage2 = searchMessageFlow(e, msgFlow, messages);
							}
						}
						flage = flage1 && flage2;
						if (flage == false) {
							num++;
							elementsBPMN.add(e);
							String name = e.getName() != null ? e.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(e.getId(), IDProcess, name);
						}
					}
				}
			}
		}

		if (num > 0) {
			this.Suggestion += Messages.getString("LabelingMessageEvent.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("LabelingMessageEvent.SuggestionOK", l); //$NON-NLS-1$
		}

	}

	protected void searchSubProcess(SubProcess sub) {

		int num = 0;
		boolean flage = true;
		List<MessageFlow> msgFlow = BPMNUtils.getAllMessageFlow(diagram);
		List<Message> messages = new ArrayList<Message>();

		for (FlowElement fe : sub.getFlowElements()) {
			if (fe instanceof StartEvent) {
				boolean flags1 = true;
				boolean flags2 = true;
				StartEvent s = (StartEvent) fe;
				List<EventDefinition> def = s.getEventDefinitions();
				for (EventDefinition eventDefinition : def) {
					if (eventDefinition instanceof MessageEventDefinition) {
						if (s.getName() == null || s.getName().length() < 4) {
							flags1 &= false;
						}
						if (!(searchMessageFlow(s, msgFlow, messages))) {
							flags2 = false;
						}
					}
				}
				flage = flags1 && flags2;
				if (flage == false) {
					num++;
					elementsBPMN.add(s);
					String name = s.getName() != null ? s.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(s.getId(), IDProcess, name);
				}
			} else if (fe instanceof IntermediateCatchEvent) {
				boolean flagc1 = true;
				boolean flagc2 = true;
				IntermediateCatchEvent i = (IntermediateCatchEvent) fe;
				List<EventDefinition> def = i.getEventDefinitions();
				for (EventDefinition eventDefinition : def) {
					if (eventDefinition instanceof MessageEventDefinition) {
						if (i.getName() == null || i.getName().length() < 4) {
							flagc1 &= false;
						}
						if (!(searchMessageFlow(i, msgFlow, messages))) {
							flagc2 = false;
						}
					}
				}
				flage = flagc1 && flagc2;
				if (flage == false) {
					num++;
					elementsBPMN.add(i);
					String name = i.getName() != null ? i.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(i.getId(), IDProcess, name);
				}
			} else if (fe instanceof IntermediateThrowEvent) {
				boolean flagt1 = true;
				boolean flagt2 = true;
				IntermediateThrowEvent i = (IntermediateThrowEvent) fe;
				List<EventDefinition> def = i.getEventDefinitions();
				for (EventDefinition eventDefinition : def) {
					if (eventDefinition instanceof MessageEventDefinition) {
						if (i.getName() == null || i.getName().length() < 4) {
							flagt1 &= false;
						}
						if (!(searchMessageFlow(i, msgFlow, messages))) {
							flagt2 = false;
						}
					}
				}
				flage = flagt1 && flagt2;
				if (flage == false) {
					num++;
					elementsBPMN.add(i);
					String name = i.getName() != null ? i.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(i.getId(), IDProcess, name);
				}
			} else if (fe instanceof EndEvent) {
				boolean flage1 = true;
				boolean flage2 = true;
				EndEvent e = (EndEvent) fe;
				List<EventDefinition> def = e.getEventDefinitions();
				for (EventDefinition eventDefinition : def) {
					if (eventDefinition instanceof MessageEventDefinition) {
						if (e.getName() == null || e.getName().length() < 4) {
							flage1 &= false;
						}
						if (!(searchMessageFlow(e, msgFlow, messages))) {
							flage2 = false;
						}
					}
				}
				flage = flage1 && flage2;
				if (flage == false) {
					num++;
					elementsBPMN.add(e);
					String name = e.getName() != null ? e.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(e.getId(), IDProcess, name);
				}
			}
		}

		if (num > 0) {
			this.Suggestion += Messages.getString("LabelingMessageEvent.SuggestionSubprocessKO", l) + sub.getName() //$NON-NLS-1$
					+ " "; //$NON-NLS-1$
			this.status = false;
		}
	}
}
