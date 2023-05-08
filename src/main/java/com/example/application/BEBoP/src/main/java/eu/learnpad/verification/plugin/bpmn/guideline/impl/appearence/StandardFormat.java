package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.appearence;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.eclipse.bpmn2.Activity;
import org.eclipse.bpmn2.Artifact;
import org.eclipse.bpmn2.Association;
import org.eclipse.bpmn2.Collaboration;
import org.eclipse.bpmn2.DataObject;
import org.eclipse.bpmn2.DataObjectReference;
import org.eclipse.bpmn2.DataStoreReference;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.EndEvent;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Gateway;
import org.eclipse.bpmn2.IntermediateCatchEvent;
import org.eclipse.bpmn2.IntermediateThrowEvent;
import org.eclipse.bpmn2.MessageFlow;
import org.eclipse.bpmn2.Participant;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SequenceFlow;
import org.eclipse.bpmn2.StartEvent;
import org.eclipse.bpmn2.SubProcess;
import org.eclipse.bpmn2.TextAnnotation;
import org.eclipse.bpmn2.di.BPMNDiagram;
import org.eclipse.bpmn2.di.BPMNLabel;
import org.eclipse.bpmn2.di.BPMNLabelStyle;
import org.eclipse.bpmn2.di.BPMNShape;
import org.eclipse.dd.dc.Font;
import org.eclipse.emf.ecore.util.FeatureMap;
import org.eclipse.emf.ecore.util.FeatureMap.Entry;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.reader.BPMNUtils;

public class StandardFormat extends abstractGuideline {

	public StandardFormat(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "50"; //$NON-NLS-1$
		this.Description = Messages.getString("StandardFormat.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("StandardFormat.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {

		int num = 0;
		List<StartEvent> starts = new ArrayList<StartEvent>();
		List<Activity> activities = new ArrayList<Activity>();
		List<SequenceFlow> sqFlow = new ArrayList<SequenceFlow>();
		List<Gateway> gateways = new ArrayList<Gateway>();
		List<DataObjectReference> datasRef = new ArrayList<DataObjectReference>();
		List<DataObject> datas = new ArrayList<DataObject>();
		List<IntermediateCatchEvent> catches = new ArrayList<IntermediateCatchEvent>();
		List<IntermediateThrowEvent> throwes = new ArrayList<IntermediateThrowEvent>();
		List<SubProcess> subprocesses = new ArrayList<SubProcess>();
		List<EndEvent> ends = new ArrayList<EndEvent>();
		List<DataStoreReference> stores = new ArrayList<DataStoreReference>();
		List<Association> associations = new ArrayList<Association>();
		List<TextAnnotation> texts = new ArrayList<TextAnnotation>();
		List<Participant> par = new ArrayList<Participant>();
		List<MessageFlow> msgFlow = new ArrayList<MessageFlow>();
		List<BPMNLabelStyle> styles = new ArrayList<BPMNLabelStyle>();

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Collaboration) {
				Collaboration collaboration = (Collaboration) rootElement;
				for (Participant participant : collaboration.getParticipants()) {
					if (!participant.getExtensionValues().isEmpty()) {
						par.add(participant);
					}
				}
				if (collaboration.getMessageFlows() != null || !collaboration.getMessageFlows().isEmpty()) {
					msgFlow = collaboration.getMessageFlows();
				}
			}
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				IDProcess = process.getId();

				for (FlowElement fe : process.getFlowElements()) {
					if (fe.getExtensionValues() != null) {
						if (!fe.getExtensionValues().isEmpty()) {
							if (fe instanceof StartEvent) {
								StartEvent s = (StartEvent) fe;
								starts.add(s);
							} else if (fe instanceof Activity) {
								Activity a = (Activity) fe;
								activities.add(a);
							} else if (fe instanceof SequenceFlow) {
								SequenceFlow msg = (SequenceFlow) fe;
								sqFlow.add(msg);
							} else if (fe instanceof Gateway) {
								Gateway gw = (Gateway) fe;
								gateways.add(gw);
							} else if (fe instanceof DataObjectReference) {
								DataObjectReference dataO = (DataObjectReference) fe;
								datasRef.add(dataO);
							} else if (fe instanceof DataObject) {
								DataObject dataO = (DataObject) fe;
								datas.add(dataO);
							} else if (fe instanceof IntermediateCatchEvent) {
								IntermediateCatchEvent intC = (IntermediateCatchEvent) fe;
								catches.add(intC);
							} else if (fe instanceof IntermediateThrowEvent) {
								IntermediateThrowEvent intT = (IntermediateThrowEvent) fe;
								throwes.add(intT);
							} else if (fe instanceof SubProcess) {
								SubProcess sub = (SubProcess) fe;
								subprocesses.add(sub);
							} else if (fe instanceof EndEvent) {
								EndEvent end = (EndEvent) fe;
								ends.add(end);
							} else if (fe instanceof DataStoreReference) {
								DataStoreReference store = (DataStoreReference) fe;
								stores.add(store);
							}
						}
					}
				}
				if (process.getArtifacts() != null && !process.getArtifacts().isEmpty()) {
					for (Artifact artifact : process.getArtifacts()) {
						if (artifact.getExtensionValues() != null) {
							if (!artifact.getExtensionValues().isEmpty()) {
								if (artifact instanceof Association) {
									Association asso = (Association) artifact;
									associations.add(asso);
								} else if (artifact instanceof TextAnnotation) {
									TextAnnotation text = (TextAnnotation) artifact;
									texts.add(text);
								}
							}
						}
					}
				}
			}
		}
		for (BPMNDiagram bpmnDiagram : diagram.getDiagrams()) {
			if (bpmnDiagram.getLabelStyle() != null) {
				if (bpmnDiagram.getLabelStyle().size() > 1) {
					for (int i = 0; i < bpmnDiagram.getLabelStyle().size() ; i++) {
						BPMNLabelStyle l1 = bpmnDiagram.getLabelStyle().get(i);
						for (int j = 0; j < bpmnDiagram.getLabelStyle().size(); j++) {
							BPMNLabelStyle l2 = bpmnDiagram.getLabelStyle().get(j);
							Font f1 = l1.getFont();
							Font f2 = l2.getFont();
							if (Math.abs(f2.getSize() - f1.getSize()) > 1) {
								styles = bpmnDiagram.getLabelStyle();
							}
						}
					}
				}
			}
		}

		//////////////////////////////// COLLABORATION////////////////////////////////
		if (par.size() > 1) {
			Participant p1 = par.get(0);
			for (int i = 1; i < par.size(); i++) {
				FeatureMap map1 = p1.getExtensionValues().get(0).getValue();
				FeatureMap map2 = par.get(i).getExtensionValues().get(0).getValue();
				if (!compareStyle(map1, map2)) {
					Process process = par.get(i).getProcessRef();
					num++;
					String name = par.get(i).getName() != null ? par.get(i).getName()
							: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$

					if (process != null) {
						try {
							if (process.getId() != null) {
								setElements(process.getId(), IDProcess, name);
							}
						} catch (Exception e) {
							throw new RuntimeException(e);
						}
					} else {
						// Gestione del caso in cui process è null
						// Puoi aggiungere qui il codice appropriato per gestire questa situazione
					}


				}
			}
			//////////////////////////////// LABELS////////////////////////////////
			if (styles.size() > 1) {
				for (Participant p : par) {
					if (p.getName() != null && p.getName().length() > 0) {
						BPMNShape shape = BPMNUtils.findBPMNShape(diagram, p);
						if (shape != null) {
							if (!checkLabelStyle(shape, styles)) {
								num++;
								String name = p.getName() != null ? "Style's label of " + p.getName()
										: Messages.getString("Style's label of " + "Generic.LabelEmpty", l);
								setElements(p.getId(), IDProcess, name);
							}
						}
					}
				}
			}
		}

		if (msgFlow.size() > 1) {
			MessageFlow mg1 = msgFlow.get(0);
			if (!mg1.getExtensionValues().isEmpty()) {
				for (int i = 1; i < msgFlow.size(); i++) {
					FeatureMap map1 = mg1.getExtensionValues().get(0).getValue();
					FeatureMap map2 = msgFlow.get(i).getExtensionValues().get(0).getValue();
					if (!compareStyle(map1, map2)) {
						num++;
						String name = msgFlow.get(i).getName() != null ? msgFlow.get(i).getName()
								: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
						setElements(msgFlow.get(i).getId(), IDProcess, name);
					}
				}
			}
			//////////////////////////////// LABELS////////////////////////////////
			if (styles.size() > 1) {
				for (MessageFlow m : msgFlow) {
					if (m.getName().length() > 0) {
						BPMNShape shape = BPMNUtils.findBPMNShape(diagram, m);
						if (shape != null) {
							if (!checkLabelStyle(shape, styles)) {
								num++;
								String name = m.getName() != null ? "Style's label of " + m.getName()
										: Messages.getString("Style's label of " + "Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(m.getId(), IDProcess, name);
							}
						}
					}
				}
			}
		}

		//////////////////////////////// FLOW ELEMENT////////////////////////////////
		if (starts.size() > 1) {
			StartEvent s1 = starts.get(0);
			for (int i = 1; i < starts.size(); i++) {
				FeatureMap map1 = s1.getExtensionValues().get(0).getValue();
				FeatureMap map2 = starts.get(i).getExtensionValues().get(0).getValue();
				if (!compareStyle(map1, map2)) {
					num++;
					elementsBPMN.add(starts.get(i));
					String name = starts.get(i).getName() != null ? starts.get(i).getName()
							: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(starts.get(i).getId(), IDProcess, name);
				}
			}
			//////////////////////////////// LABELS////////////////////////////////
			if (styles.size() > 1) {
				for (StartEvent s : starts) {
					if (s.getName().length() > 0) {
						BPMNShape shape = BPMNUtils.findBPMNShape(diagram, s);
						if (shape != null) {
							if (!checkLabelStyle(shape, styles)) {
								num++;
								elementsBPMN.add(s);
								String name = s.getName() != null ? "Style's label of " + s.getName()
										: Messages.getString("Style's label of " + "Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(s.getId(), IDProcess, name);
							}
						}
					}
				}
			}
		}

		if (activities.size() > 1) {
			Activity a1 = activities.get(0);
			for (int i = 1; i < activities.size(); i++) {
				FeatureMap map1 = a1.getExtensionValues().get(0).getValue();
				FeatureMap map2 = activities.get(i).getExtensionValues().get(0).getValue();
				if (!compareStyle(map1, map2)) {
					num++;
					elementsBPMN.add(activities.get(i));
					String name = activities.get(i).getName() != null ? activities.get(i).getName()
							: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(activities.get(i).getId(), IDProcess, name);
				}
			}
			//////////////////////////////// LABELS////////////////////////////////
			if (styles.size() > 1) {
				for (Activity a : activities) {
					if (a.getName().length() > 0 && a.getName() != null) {
						BPMNShape shape = BPMNUtils.findBPMNShape(diagram, a);
						if (shape != null) {
							if (!checkLabelStyle(shape, styles)) {
								num++;
								elementsBPMN.add(a);
								String name = a.getName() != null ? "Style's label of " + a.getName()
										: Messages.getString("Style's label of " + "Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(a.getId(), IDProcess, name);
							}
						}
					}
				}
			}
		}

		if (sqFlow.size() > 1) {
			SequenceFlow m1 = sqFlow.get(0);
			for (int i = 1; i < sqFlow.size(); i++) {
				FeatureMap map1 = m1.getExtensionValues().get(0).getValue();
				FeatureMap map2 = sqFlow.get(i).getExtensionValues().get(0).getValue();
				if (!compareStyle(map1, map2)) {
					num++;
					elementsBPMN.add(sqFlow.get(i));
					String name = sqFlow.get(i).getName() != null ? sqFlow.get(i).getName()
							: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(sqFlow.get(i).getId(), IDProcess, name);
				}
			}
			//////////////////////////////// LABELS////////////////////////////////
			if (styles.size() > 1) {
				for (SequenceFlow f : sqFlow) {
					if (f.getName().length() > 0) {
						BPMNShape shape = BPMNUtils.findBPMNShape(diagram, f);
						if (shape != null) {
							if (!checkLabelStyle(shape, styles)) {
								num++;
								elementsBPMN.add(f);
								String name = f.getName() != null ? "Style's label of " + f.getName()
										: Messages.getString("Style's label of " + "Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(f.getId(), IDProcess, name);
							}
						}
					}
				}
			}
		}

		if (gateways.size() > 1) {
			Gateway g1 = gateways.get(0);
			for (int i = 1; i < gateways.size(); i++) {
				FeatureMap map1 = g1.getExtensionValues().get(0).getValue();
				FeatureMap map2 = gateways.get(i).getExtensionValues().get(0).getValue();
				if (!compareStyle(map1, map2)) {
					num++;
					elementsBPMN.add(gateways.get(i));
					String name = gateways.get(i).getName() != null ? gateways.get(i).getName()
							: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(gateways.get(i).getId(), IDProcess, name);
				}
			}
			//////////////////////////////// LABELS////////////////////////////////
			if (styles.size() > 1) {
				for (Gateway g : gateways) {
					if (g.getName().length() > 0) {
						BPMNShape shape = BPMNUtils.findBPMNShape(diagram, g);
						if (shape != null) {
							if (!checkLabelStyle(shape, styles)) {
								num++;
								elementsBPMN.add(g);
								String name = g.getName() != null ? "Style's label of " + g.getName()
										: Messages.getString("Style's label of " + "Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(g.getId(), IDProcess, name);
							}
						}
					}
				}
			}
		}

		if (datas.size() > 1) {
			DataObject d1 = datas.get(0);
			for (int i = 1; i < datas.size(); i++) {
				FeatureMap map1 = d1.getExtensionValues().get(0).getValue();
				FeatureMap map2 = datas.get(i).getExtensionValues().get(0).getValue();
				if (!compareStyle(map1, map2)) {
					num++;
					elementsBPMN.add(datas.get(i));
					String name = datas.get(i).getName() != null ? datas.get(i).getName()
							: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(datas.get(i).getId(), IDProcess, name);
				}
			}
			//////////////////////////////// LABELS////////////////////////////////
			if (styles.size() > 1) {
				for (DataObject d : datas) {
					if (d.getName().length() > 0) {
						BPMNShape shape = BPMNUtils.findBPMNShape(diagram, d);
						if (shape != null) {
							if (!checkLabelStyle(shape, styles)) {
								num++;
								elementsBPMN.add(d);
								String name = d.getName() != null ? "Style's label of " + d.getName()
										: Messages.getString("Style's label of " + "Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(d.getId(), IDProcess, name);
							}
						}
					}
				}
			}
		}

		if (datasRef.size() > 1) {
			DataObjectReference d1 = datasRef.get(0);
			for (int i = 1; i < datas.size(); i++) {
				FeatureMap map1 = d1.getExtensionValues().get(0).getValue();
				FeatureMap map2 = datas.get(i).getExtensionValues().get(0).getValue();
				if (!compareStyle(map1, map2)) {
					num++;
					elementsBPMN.add(datas.get(i));
					String name = datas.get(i).getName() != null ? datas.get(i).getName()
							: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(datas.get(i).getId(), IDProcess, name);
				}
			}
			//////////////////////////////// LABELS////////////////////////////////
			if (styles.size() > 1) {
				for (DataObjectReference d : datasRef) {
					if (d.getName().length() > 0) {
						BPMNShape shape = BPMNUtils.findBPMNShape(diagram, d);
						if (shape != null) {
							if (!checkLabelStyle(shape, styles)) {
								num++;
								elementsBPMN.add(d);
								String name = d.getName() != null ? "Style's label of " + d.getName()
										: Messages.getString("Style's label of " + "Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(d.getId(), IDProcess, name);
							}
						}
					}
				}
			}
		}

		if (stores.size() > 1) {
			DataStoreReference d1 = stores.get(0);
			for (int i = 1; i < stores.size(); i++) {
				FeatureMap map1 = d1.getExtensionValues().get(0).getValue();
				FeatureMap map2 = stores.get(i).getExtensionValues().get(0).getValue();
				if (!compareStyle(map1, map2)) {
					num++;
					elementsBPMN.add(stores.get(i));
					String name = stores.get(i).getName() != null ? stores.get(i).getName()
							: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(stores.get(i).getId(), IDProcess, name);
				}
			}
			//////////////////////////////// LABELS////////////////////////////////
			if (styles.size() > 1) {
				for (DataStoreReference d : stores) {
					if (d.getName().length() > 0) {
						BPMNShape shape = BPMNUtils.findBPMNShape(diagram, d);
						if (shape != null) {
							if (!checkLabelStyle(shape, styles)) {
								num++;
								elementsBPMN.add(d);
								String name = d.getName() != null ? "Style's label of " + d.getName()
										: Messages.getString("Style's label of " + "Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(d.getId(), IDProcess, name);
							}
						}
					}
				}
			}
		}

		if (catches.size() > 1) {
			IntermediateCatchEvent c1 = catches.get(0);
			for (int i = 1; i < catches.size(); i++) {
				FeatureMap map1 = c1.getExtensionValues().get(0).getValue();
				FeatureMap map2 = catches.get(i).getExtensionValues().get(0).getValue();
				if (!compareStyle(map1, map2)) {
					num++;
					elementsBPMN.add(catches.get(i));
					String name = catches.get(i).getName() != null ? catches.get(i).getName()
							: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(catches.get(i).getId(), IDProcess, name);
				}
			}
			//////////////////////////////// LABELS////////////////////////////////
			if (styles.size() > 1) {
				for (IntermediateCatchEvent c : catches) {
					if (c.getName().length() > 0) {
						BPMNShape shape = BPMNUtils.findBPMNShape(diagram, c);
						if (shape != null) {
							if (!checkLabelStyle(shape, styles)) {
								num++;
								elementsBPMN.add(c);
								String name = c.getName() != null ? "Style's label of " + c.getName()
										: Messages.getString("Style's label of " + "Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(c.getId(), IDProcess, name);
							}
						}
					}
				}
			}
		}

		if (throwes.size() > 1) {
			IntermediateThrowEvent t1 = throwes.get(0);
			for (int i = 1; i < throwes.size(); i++) {
				FeatureMap map1 = t1.getExtensionValues().get(0).getValue();
				FeatureMap map2 = throwes.get(i).getExtensionValues().get(0).getValue();
				if (!compareStyle(map1, map2)) {
					num++;
					elementsBPMN.add(throwes.get(i));
					String name = throwes.get(i).getName() != null ? throwes.get(i).getName()
							: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(throwes.get(i).getId(), IDProcess, name);
				}
			}
			//////////////////////////////// LABELS////////////////////////////////
			if (styles.size() > 1) {
				for (IntermediateThrowEvent t : throwes) {
					if (t.getName().length() > 0) {
						BPMNShape shape = BPMNUtils.findBPMNShape(diagram, t);
						if (shape != null) {
							if (!checkLabelStyle(shape, styles)) {
								num++;
								elementsBPMN.add(t);
								String name = t.getName() != null ? "Style's label of " + t.getName()
										: Messages.getString("Style's label of " + "Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(t.getId(), IDProcess, name);
							}
						}
					}
				}
			}
		}

		if (subprocesses.size() > 1) {
			SubProcess s1 = subprocesses.get(0);
			for (int i = 1; i < subprocesses.size(); i++) {
				FeatureMap map1 = s1.getExtensionValues().get(0).getValue();
				FeatureMap map2 = subprocesses.get(i).getExtensionValues().get(0).getValue();
				if (!compareStyle(map1, map2)) {
					num++;
					elementsBPMN.add(subprocesses.get(i));
					String name = subprocesses.get(i).getName() != null ? subprocesses.get(i).getName()
							: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(subprocesses.get(i).getId(), IDProcess, name);
				}
			}
			//////////////////////////////// LABELS////////////////////////////////
			if (styles.size() > 1) {
				for (SubProcess s : subprocesses) {
					if (s.getName().length() > 0) {
						BPMNShape shape = BPMNUtils.findBPMNShape(diagram, s);
						if (shape != null) {
							if (!checkLabelStyle(shape, styles)) {
								num++;
								elementsBPMN.add(s);
								String name = s.getName() != null ? "Style's label of " + s.getName()
										: Messages.getString("Style's label of " + "Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(s.getId(), IDProcess, name);
							}
						}
					}
				}
			}
		}

		if (ends.size() > 1) {
			EndEvent e1 = ends.get(0);
			for (int i = 1; i < ends.size(); i++) {
				FeatureMap map1 = e1.getExtensionValues().get(0).getValue();
				FeatureMap map2 = ends.get(i).getExtensionValues().get(0).getValue();
				if (!compareStyle(map1, map2)) {
					num++;
					elementsBPMN.add(ends.get(i));
					String name = ends.get(i).getName() != null ? ends.get(i).getName()
							: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(ends.get(i).getId(), IDProcess, name);
				}
			}
			//////////////////////////////// LABELS////////////////////////////////
			if (styles.size() > 1) {
				for (EndEvent e : ends) {
					if (e.getName().length() > 0) {
						BPMNShape shape = BPMNUtils.findBPMNShape(diagram, e);
						if (shape != null) {
							if (!checkLabelStyle(shape, styles)) {
								num++;
								elementsBPMN.add(e);
								String name = e.getName() != null ? "Style's label of " + e.getName()
										: Messages.getString("Style's label of " + "Generic.LabelEmpty", l); //$NON-NLS-1$
								setElements(e.getId(), IDProcess, name);
							}
						}
					}
				}
			}
		}

		//////////////////////////////// ARTIFACTS////////////////////////////////
		if (associations.size() > 1) {
			Association a1 = associations.get(0);
			for (int i = 1; i < associations.size(); i++) {
				FeatureMap map1 = a1.getExtensionValues().get(0).getValue();
				FeatureMap map2 = associations.get(i).getExtensionValues().get(0).getValue();
				if (!compareStyle(map1, map2)) {
					num++;
					String name = Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(associations.get(i).getId(), IDProcess, name);
				}
			}
		}

		if (texts.size() > 1) {
			TextAnnotation t1 = texts.get(0);
			for (int i = 1; i < texts.size(); i++) {
				FeatureMap map1 = t1.getExtensionValues().get(0).getValue();
				FeatureMap map2 = texts.get(i).getExtensionValues().get(0).getValue();
				if (!compareStyle(map1, map2)) {
					num++;
					String name = Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
					setElements(texts.get(i).getId(), IDProcess, name);
				}
			}
		}

		if (num > 0) {
			this.Suggestion += Messages.getString("StandardFormat.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;

		} else {
			this.status = true;
			this.Suggestion += Messages.getString("StandardFormat.SuggestionOK", l); //$NON-NLS-1$
		}
	}

	private boolean compareStyle(FeatureMap map1, FeatureMap map2) {
		boolean flag = true;
		if (map1 != null && map2 != null && map1.size() == map2.size()) {
			for (int i = 0; i < map1.size(); i++) {
				Entry e1 = map1.get(i);
				Entry e2 = map2.get(i);
				String t1 = e1.toString();
				String t2 = e2.toString();
				String[] s1 = t1.split("anyAttribute:");
				String[] s2 = t2.split("anyAttribute:");

				if (!s1[1].equals(s2[1])) {
					flag = false;
				}
			}
		} else {
			flag = false; // Se le mappe hanno dimensioni diverse, considera i valori non uguali
		}
		return flag;
	}


	private boolean checkLabelStyle(BPMNShape shape, List<BPMNLabelStyle> styles) {
		BPMNLabel label = shape.getLabel();
		BPMNLabelStyle style = label.getLabelStyle();
		String labelStyle[] = style.toString().split("#");
		if (style != null && label != null) {
			if (labelStyle[1].contains(styles.get(0).getId())) {
				return true;
			}
		}
		return false;
	}

}
