package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.notationusage;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;

import org.eclipse.bpmn2.Collaboration;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Participant;
import org.eclipse.bpmn2.MessageFlow;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.impl.InteractionNodeImpl;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.utils.ElementID;

public class ConsistentUsagePools extends abstractGuideline {

	public ConsistentUsagePools(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "10"; //$NON-NLS-1$
		this.Description = Messages.getString("ConsistentUsagePools.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("ConsistentUsagePools.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {
		StringBuilder temp = new StringBuilder();
		Collection<ElementID> Elementstemp = new ArrayList<ElementID>();
		String parId = null;
		int num = 0;
		int nProc = 0;
		int mPool = 0;
		int z = 0;
		boolean flag = true;
		Process process = null;
		List<MessageFlow> msgFlow = new ArrayList<MessageFlow>();
		List<Participant> participants = new ArrayList<Participant>();

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Collaboration) {
				Collaboration collaboration = (Collaboration) rootElement;
				participants = collaboration.getParticipants();
				msgFlow = collaboration.getMessageFlows();
			}

			if (rootElement instanceof Process) {
				process = (Process) rootElement;
				IDProcess = process.getId();
				nProc++;
				if (!process.getFlowElements().isEmpty()) {
					num++;
				}

				for (FlowElement fe : process.getFlowElements()) {
					String feId = fe.getId();
					if (!msgFlow.isEmpty())
						for (MessageFlow messflow : msgFlow) {
							if (messflow.getSourceRef() instanceof InteractionNodeImpl) {
								InteractionNodeImpl source = (InteractionNodeImpl) messflow.getSourceRef();
								InteractionNodeImpl target = (InteractionNodeImpl) messflow.getTargetRef();
								String fragments = source.eProxyURI().fragment();
								String fragmentt = target.eProxyURI().fragment();
								if (feId.equals(fragmentt) || feId.equals(fragments)) {
									z++;
								}

							} else {
								if (messflow.getSourceRef() instanceof FlowElement) {
									if (fe.equals(messflow.getSourceRef()) || fe.equals(messflow.getTargetRef())) {
										z++;
									}

								}
							}
						}
				}
			}
		}

		if (num > 1) {
			for (Participant p : participants) {
				String name = p.getName() != null ? p.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
				Elementstemp.add(new ElementID(p.getId(), IDProcess, name));
				temp.append("Name=" + name + " ID=" + p.getId() //$NON-NLS-1$ //$NON-NLS-2$
						+ "; "); //$NON-NLS-1$
			}
		}

		// CASO MAINPOOL E POOL COLLASSATE: DEVONO ESSERE COLLEGATE TRA DI LORO TRAMITE
		// MSG FLOW
		// E CI DEVE ESSERE ALMENO UN MSG FLOW COLLEGATO AI FLOW ELEMENT DELLA MAIN POOL
		if (num == 1 && nProc > num) {
			for (Participant p : participants) {
				parId = p.getId();
				if (!msgFlow.isEmpty()) {
					for (MessageFlow messflow : msgFlow) {
						if (messflow.getSourceRef() instanceof InteractionNodeImpl) {
							InteractionNodeImpl source = (InteractionNodeImpl) messflow.getSourceRef();
							InteractionNodeImpl target = (InteractionNodeImpl) messflow.getTargetRef();
							String fragments = source.eProxyURI().fragment();
							String fragmentt = target.eProxyURI().fragment();
							if (parId.equals(fragmentt) || parId.equals(fragments)) {
								mPool++;
							}
						} else {
							if (messflow.getSourceRef() instanceof Participant) {
								if (p.equals(messflow.getSourceRef()) || p.equals(messflow.getTargetRef())) {
									mPool++;
								}
							}
						}
					}
				} else {
					flag = false;
				}

				if (z > 0) {
					if (nProc > 2) {
						if (mPool >= nProc - 1) {
							flag = true;
						} else {
							flag = false;
							String name = p.getName() != null ? p.getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							Elementstemp.add(new ElementID(p.getId(), IDProcess, name));
							temp.append("Name=" + name + " ID=" + p.getId() //$NON-NLS-1$ //$NON-NLS-2$
									+ "; "); //$NON-NLS-1$
						}
					}
				} else {
					flag = false;
					String name = p.getName() != null ? p.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					Elementstemp.add(new ElementID(p.getId(), IDProcess, name));
					temp.append("Name=" + name + " ID=" + p.getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "; "); //$NON-NLS-1$
				}
			}
		}

		// CASO INSIEME DI POOL COLLASSATE: DEVONO COMUNQUE ESSERE COLLEGATE TRA DI LORO
		// TRAMITE MSG FLOW
		if (num == 0 && nProc > num) {
			for (Participant p : participants) {
				parId = p.getId();
				if (!msgFlow.isEmpty()) {
					for (MessageFlow messflow : msgFlow) {
						if (messflow.getSourceRef() instanceof InteractionNodeImpl) {
							InteractionNodeImpl source = (InteractionNodeImpl) messflow.getSourceRef();
							InteractionNodeImpl target = (InteractionNodeImpl) messflow.getTargetRef();
							String fragments = source.eProxyURI().fragment();
							String fragmentt = target.eProxyURI().fragment();
							if (parId.equals(fragmentt) || parId.equals(fragments)) {
								mPool++;
							}
						} else {
							if (messflow.getSourceRef() instanceof Participant) {
								if (p.equals(messflow.getSourceRef()) || p.equals(messflow.getTargetRef())) {
									mPool++;
								}
							}
						}
					}
				} else {
					flag = false;
				}

				if (mPool < nProc - 1) {
					flag = false;
					String name = p.getName() != null ? p.getName() : Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					Elementstemp.add(new ElementID(p.getId(), IDProcess, name));
					temp.append("Name=" + name + " ID=" + p.getId() //$NON-NLS-1$ //$NON-NLS-2$
							+ "; "); //$NON-NLS-1$
				}
			}
		}

		if (num <= 1 && flag == true) {
			this.status = true;
			this.Suggestion += Messages.getString("ConsistentUsagePools.SuggestionOK", l); //$NON-NLS-1$
		} else {
			setAllElements(Elementstemp);
			this.Suggestion += Messages.getString("ConsistentUsagePools.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		}
	}

}