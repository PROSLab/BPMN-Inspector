package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.appearence;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.eclipse.bpmn2.Artifact;
import org.eclipse.bpmn2.Association;
import org.eclipse.bpmn2.BaseElement;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.Event;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.MessageFlow;
import org.eclipse.bpmn2.Participant;
import org.eclipse.bpmn2.BoundaryEvent;
import org.eclipse.bpmn2.Collaboration;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SequenceFlow;
import org.eclipse.bpmn2.SubProcess;
import org.eclipse.bpmn2.TextAnnotation;
import org.eclipse.bpmn2.di.BPMNEdge;
import org.eclipse.bpmn2.di.BPMNShape;
import org.eclipse.bpmn2.impl.InteractionNodeImpl;
import org.eclipse.dd.dc.Bounds;
import org.eclipse.dd.dc.Point;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl.abstractGuideline;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.reader.BPMNUtils;
import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.utils.ElementID;

public class AvoidOverlapping extends abstractGuideline {

	public AvoidOverlapping(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "44"; //$NON-NLS-1$
		this.Description = Messages.getString("AvoidOverlapping.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("AvoidOverlapping.Name", l); //$NON-NLS-1$

	}

	private boolean shapeOverlapping(BPMNShape firstShape, BPMNShape secondShape) {
		Bounds firstBounds = firstShape.getBounds();
		Bounds secondBounds = secondShape.getBounds();

		if (firstBounds == null || secondBounds == null) {
			return false;
		}

		float x1 = firstBounds.getX();
		float y1 = firstBounds.getY();
		float w1 = firstBounds.getWidth();
		float h1 = firstBounds.getHeight();

		float x2 = secondBounds.getX();
		float y2 = secondBounds.getY();
		float w2 = secondBounds.getWidth();
		float h2 = secondBounds.getHeight();

		boolean inRangeHorizontally = (isFloatInRange(x1, x2, x2 + w2) || isFloatInRange(x1 + w1, x2, x2 + w2)
				|| isFloatInRange(x2, x1, x1 + w1) || isFloatInRange(x2 + w2, x1, x1 + w1));
		boolean inRangeVertically = (isFloatInRange(y1, y2, y2 + h2) || isFloatInRange(y1 + h1, y2, y2 + h2)
				|| isFloatInRange(y2, y1, y1 + h1) || isFloatInRange(y2 + h2, y1, y1 + h1));

		return (inRangeHorizontally && inRangeVertically);
	}

	private boolean flowCrossing(BPMNShape shape, Point first, Point last) {
		float x1 = shape.getBounds().getX();
		float y1 = shape.getBounds().getY();
		float w1 = shape.getBounds().getWidth();
		float h1 = shape.getBounds().getHeight();

		boolean Hor = (isFloatInRange2(x1, first.getX(), last.getX()) || isFloatInRange2(x1, last.getX(), first.getX())
				|| isFloatInRange2(x1 + w1, first.getX(), last.getX())
				|| isFloatInRange2(x1 + w1, last.getX(), first.getX()));
		boolean Hor2 = (isFloatInRange2(first.getY(), y1, y1 + h1) || isFloatInRange2(last.getY(), y1, y1 + h1));
		boolean Ver = (isFloatInRange2(y1, first.getY(), last.getY()) || isFloatInRange2(y1, last.getY(), first.getY())
				|| isFloatInRange2(y1 + h1, first.getY(), last.getY())
				|| isFloatInRange2(y1 + h1, last.getY(), first.getY()));
		boolean Ver2 = (isFloatInRange2(first.getX(), x1, x1 + w1) || isFloatInRange2(last.getX(), x1, x1 + w1));

		return ((Hor && Hor2) || (Ver && Ver2));
	}

	private boolean isFloatInRange(float toCompare, float minValue, float maxValue) {
		return (Float.compare(toCompare, minValue) >= 0) && (Float.compare(toCompare, maxValue) <= 0);
	}

	private boolean isFloatInRange2(float toCompare, float minValue, float maxValue) {
		return (Float.compare(toCompare, minValue) > 0) && (Float.compare(toCompare, maxValue) < 0);
	}

	@Override
	protected void findGL(Definitions diagram) {

		int num = 0;
		int z = 0;
		Collection<FlowElement> elementsBPMNtemp = new ArrayList<FlowElement>();
		Collection<ElementID> Elementstemp = new ArrayList<ElementID>();
		List<FlowElement> shapes = new ArrayList<FlowElement>();
		List<MessageFlow> flows = BPMNUtils.getAllMessageFlow(diagram);
		List<SequenceFlow> flows2 = new ArrayList<SequenceFlow>();
		List<Association> flows3 = new ArrayList<Association>();
		List<Participant> par = new ArrayList<Participant>();

		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Collaboration) {
				Collaboration collaboration = (Collaboration) rootElement;
				for (Participant participant : collaboration.getParticipants()) {
					par.add(participant);
				}
				for (MessageFlow mf : collaboration.getMessageFlows()) {
					flows.add(mf);
				}
			}
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				IDProcess = process.getId();
				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof SubProcess) {
						SubProcess sub = (SubProcess) fe;
						this.searchSubProcess(sub);
						shapes.add(sub);
					} else if (fe instanceof SequenceFlow) {
						SequenceFlow sq = (SequenceFlow) fe;
						flows2.add(sq);
					} else if (!(fe instanceof BoundaryEvent) && !(fe instanceof SequenceFlow)) {
						BPMNShape shape = BPMNUtils.findBPMNShape(diagram, fe);
						if (shape != null) {
							shapes.add(fe);
						}
					}
				}
				if (process.getArtifacts() != null && !process.getArtifacts().isEmpty()) {
					for (Artifact artifact : process.getArtifacts()) {
						if (artifact instanceof Association) {
							Association asso = (Association) artifact;
							flows3.add(asso);
						}
					}
				}
			}
		}

		//////////////////////////////// OVERLAPPING ////////////////////////////////
		//////////////////////////////// PARTICIPANTS ////////////////////////////////
		if (par.size() > 1) {
			for (int i = 0; i < par.size(); i++) {
				BPMNShape shape1 = BPMNUtils.findBPMNShape(diagram, par.get(i));
				for (int j = 1; j < par.size(); j++) {
					if (par.get(i) != par.get(j)) {
						BPMNShape shape2 = BPMNUtils.findBPMNShape(diagram, par.get(j));
						if (shapeOverlapping(shape1, shape2)) {
							num++;
							String name = par.get(j).getName() != null ? par.get(j).getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(par.get(j).getId(), IDProcess, name);
							// String name = par.get(j).getName()!=null? par.get(j).getName() :
							// Messages.getString("Generic.LabelEmpty",l); //$NON-NLS-1$
							// Elementstemp.add(new
							// ElementID(par.get(j).getId(),par.get(j).getProcessRef().getId(),name));
							// temp.append("Name=" +name + " ID=" + par.get(j).getId() //$NON-NLS-1$
							// //$NON-NLS-2$
							// + "; "); //$NON-NLS-1$
						}
					}
				}
			}
		}
		//////////////////////////////// FLOW ELEMENTS ////////////////////////////////
		if (shapes.size() > 1) {
			for (int i = 0; i < shapes.size(); i++) {
				BPMNShape shape1 = BPMNUtils.findBPMNShape(diagram, shapes.get(i));
				for (int j = 1; j < shapes.size(); j++) {
					if (shapes.get(i) != shapes.get(j)) {
						BPMNShape shape2 = BPMNUtils.findBPMNShape(diagram, shapes.get(j));
						if (shapeOverlapping(shape1, shape2)) {
							num++;
							elementsBPMN.add(shapes.get(j));
							String name = shapes.get(j).getName() != null ? shapes.get(j).getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(shapes.get(j).getId(), IDProcess, name);
						}
					}
				}
			}
		}
		//////////////////////////////// CROSSING ////////////////////////////////

		if (flows2 != null) {
			for (SequenceFlow sqFlow : flows2) {
				for (FlowElement fe : shapes) {
					BPMNShape shape = BPMNUtils.findBPMNShape(diagram, fe);
					Map<BaseElement, BPMNEdge> BPMNEdges = BPMNUtils.getAllBPMNEdge(diagram);
					for (BaseElement base : BPMNEdges.keySet()) {
						BPMNEdge bpmnEdge = BPMNEdges.get(base);
						if (bpmnEdge != null && bpmnEdge.getId() != null && bpmnEdge.getId().contains(sqFlow.getId())) {
							if (sqFlow.getSourceRef() instanceof FlowElement) {
								if (fe.equals(sqFlow.getSourceRef()) || fe.equals(sqFlow.getTargetRef())) {
									List<Point> points = bpmnEdge.getWaypoint();
									Point first = null;
									for (Point last : points) {
										if (first == null) {
											first = last;
										} else {
											if (flowCrossing(shape, first, last)) {
												num++;
												elementsBPMN.add(sqFlow);
												String name = sqFlow.getName() != null ? sqFlow.getName()
														: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
												setElements(sqFlow.getId(), IDProcess, name);
												first = last;
											} else {
												first = last;
											}
										}
									}
								} else {
									List<Point> points = bpmnEdge.getWaypoint();
									Point first = null;
									for (Point last : points) {
										if (first == null) {
											first = last;
										} else {
											if (flowCrossing(shape, first, last)) {
												num++;
												elementsBPMN.add(sqFlow);
												String name = sqFlow.getName() != null ? sqFlow.getName()
														: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
												setElements(sqFlow.getId(), IDProcess, name);
												first = last;
											} else {
												first = last;
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

		if (flows3 != null) {
			for (Association asso : flows3) {
				for (FlowElement fe : shapes) {
					BPMNShape shape = BPMNUtils.findBPMNShape(diagram, fe);
					Map<BaseElement, BPMNEdge> BPMNEdges = BPMNUtils.getAllBPMNEdge(diagram);
					for (BaseElement base : BPMNEdges.keySet()) {
						if (BPMNEdges.get(base).getId().contains(asso.getId())) {
							List<Point> points = BPMNEdges.get(base).getWaypoint();
							Point first = null;
							for (Point last : points) {
								if (first == null) {
									first = last;
								} else {
									if (flowCrossing(shape, first, last)) {
										num++;
										String name = Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
										setElements(asso.getId(), IDProcess, name);
										first = last;
									} else {
										first = last;
									}
								}
							}
						}
					}
				}
			}
		}
		if (flows != null) {
			for (MessageFlow msgFlow : flows) {
				for (FlowElement fe : shapes) {
					BPMNShape shape = BPMNUtils.findBPMNShape(diagram, fe);
					Map<BaseElement, BPMNEdge> BPMNEdges = BPMNUtils.getAllBPMNEdge(diagram);
					for (BaseElement base : BPMNEdges.keySet()) {
						if (BPMNEdges.get(base).getId().contains(msgFlow.getId())) {
							if (msgFlow.getSourceRef() instanceof InteractionNodeImpl) {
								InteractionNodeImpl source = (InteractionNodeImpl) msgFlow.getSourceRef();
								InteractionNodeImpl target = (InteractionNodeImpl) msgFlow.getTargetRef();
								String fragments = source.eProxyURI().fragment();
								String fragmentt = target.eProxyURI().fragment();
								String xid = fe.getId();
								if (xid.equals(fragmentt) || xid.equals(fragments)) {
								} else {
									List<Point> points = BPMNEdges.get(base).getWaypoint();
									Point first = null;
									for (Point last : points) {
										if (first == null) {
											first = last;
										} else {
											if (flowCrossing(shape, first, last)) {
												num++;
												String name = msgFlow.getName() != null ? msgFlow.getName()
														: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
												setElements(msgFlow.getId(), IDProcess, name);
												first = last;
											} else {
												first = last;
											}
										}
									}
								}
							} else {
								if (msgFlow.getSourceRef() instanceof FlowElement) {
									if (fe.equals(msgFlow.getSourceRef()) || fe.equals(msgFlow.getTargetRef())) {
									} else {
										List<Point> points = BPMNEdges.get(base).getWaypoint();
										Point first = null;
										for (Point last : points) {
											if (first == null) {
												first = last;
											} else {
												if (flowCrossing(shape, first, last)) {
													num++;
													String name = msgFlow.getName() != null ? msgFlow.getName()
															: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
													setElements(msgFlow.getId(), IDProcess, name);
													first = last;
												} else {
													first = last;
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

		if (num == 0 && z == 0)

		{
			this.status = true;
			this.Suggestion += Messages.getString("AvoidOverlapping.SuggestionOK", l); //$NON-NLS-1$
		} else {
			elementsBPMN.addAll(elementsBPMNtemp);
			setAllElements(Elementstemp);
			this.Suggestion += Messages.getString("AvoidOverlapping.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		}
	}

	protected void searchSubProcess(SubProcess sub) {
		int num = 0;
		List<FlowElement> shapes = new ArrayList<FlowElement>();

		for (FlowElement fe : sub.getFlowElements()) {
			if (fe instanceof SubProcess) {
				SubProcess ssub = (SubProcess) fe;
				this.searchSubProcess(ssub);
			} else if (!(fe instanceof BoundaryEvent) && !(fe instanceof SequenceFlow)) {
				BPMNShape shape = BPMNUtils.findBPMNShape(diagram, fe);
				if (shape != null) {
					shapes.add(fe);
				}
			}
		}
		if (shapes.size() > 1) {
			for (int i = 0; i < shapes.size(); i++) {
				BPMNShape shape1 = BPMNUtils.findBPMNShape(diagram, shapes.get(i));
				for (int j = 1; j < shapes.size(); j++) {
					if (shapes.get(i) != shapes.get(j)) {
						BPMNShape shape2 = BPMNUtils.findBPMNShape(diagram, shapes.get(j));
						if (shapeOverlapping(shape1, shape2)) {
							num++;
							elementsBPMN.add(shapes.get(j));
							String name = shapes.get(j).getName() != null ? shapes.get(j).getName()
									: Messages.getString("Generic.LabelEmpty", l); //$NON-NLS-1$
							setElements(shapes.get(j).getId(), IDProcess, name);
						}
					}
				}
			}
		}
		if (num > 0) {
			this.Suggestion += Messages.getString("AvoidOverlapping.SuggestionKO", l) + sub.getName() //$NON-NLS-1$
					+ " "; //$NON-NLS-1$
			this.status = false;
		}
	}
}
