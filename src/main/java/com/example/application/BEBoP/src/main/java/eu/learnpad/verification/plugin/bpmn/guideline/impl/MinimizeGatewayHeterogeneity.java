package com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.impl;

import java.util.Locale;

import org.eclipse.bpmn2.ComplexGateway;
import org.eclipse.bpmn2.Definitions;
import org.eclipse.bpmn2.ExclusiveGateway;
import org.eclipse.bpmn2.FlowElement;
import org.eclipse.bpmn2.Gateway;
import org.eclipse.bpmn2.InclusiveGateway;
import org.eclipse.bpmn2.ParallelGateway;
import org.eclipse.bpmn2.Process;
import org.eclipse.bpmn2.RootElement;
import org.eclipse.bpmn2.SubProcess;

import com.example.application.BEBoP.src.main.java.eu.learnpad.verification.plugin.bpmn.guideline.Messages;

public class MinimizeGatewayHeterogeneity extends abstractGuideline {

	public MinimizeGatewayHeterogeneity(Definitions diagram, Locale l) {
		super(diagram, l);
		this.l = l;
		this.id = "9"; //$NON-NLS-1$
		this.Description = Messages.getString("MinimizeGatewayHeterogeneity.Description", l); //$NON-NLS-1$
		this.Name = Messages.getString("MinimizeGatewayHeterogeneity.Name", l); //$NON-NLS-1$

	}

	@Override
	protected void findGL(Definitions diagram) {
		// StringBuilder ret = new StringBuilder("");

		int neg = 0;
		int npg = 0;
		int nig = 0;
		int ncg = 0;
		for (RootElement rootElement : diagram.getRootElements()) {
			if (rootElement instanceof Process) {
				Process process = (Process) rootElement;
				// System.out.format("Found a process: %s\n", process.getName());

				IDProcess = process.getId();
				for (FlowElement fe : process.getFlowElements()) {
					if (fe instanceof SubProcess) {
						SubProcess sub = (SubProcess) fe;
						// System.out.format("Found a SubProcess: %s\n", sub.getName());
						this.searchSubProcess(sub);
					} else if (fe instanceof Gateway) {
						Gateway gateway = (Gateway) fe;
						if (gateway instanceof ExclusiveGateway) {
							neg++;
						} else if (gateway instanceof ParallelGateway) {
							npg++;
						} else if (gateway instanceof InclusiveGateway) {
							nig++;
						} else if (gateway instanceof ComplexGateway) {
							ncg++;
						}
					}
				}
			}
		}
		int sum = neg + npg + nig + ncg;
		long geg = sum > 0 ? (neg / sum) : 0;
		long gpg = sum > 0 ? (npg / sum) : 0;
		long gig = sum > 0 ? (nig / sum) : 0;
		long gcg = sum > 0 ? (ncg / sum) : 0;
		long sum2 = (geg * logOfBase(3, geg)) + (gpg * logOfBase(3, gpg)) + (gig * logOfBase(3, gig))
				+ (gcg * logOfBase(3, gcg));
		if (sum2 > 0.92) {
			this.Suggestion += Messages.getString("MinimizeGatewayHeterogeneity.SuggestionKO", l); //$NON-NLS-1$
			this.status = false;
		} else {
			this.status = true;
			this.Suggestion += Messages.getString("MinimizeGatewayHeterogeneity.SuggestionOK", l); //$NON-NLS-1$
		}
	}

	protected void searchSubProcess(SubProcess sub) {
		// StringBuilder temp = new StringBuilder();

		int neg = 0;
		int npg = 0;
		int nig = 0;
		int ncg = 0;
		for (FlowElement fe : sub.getFlowElements()) {
			if (fe instanceof SubProcess) {
				SubProcess ssub = (SubProcess) fe;
				// System.out.format("Found a SubProcess: %s\n", ssub.getName());
				this.searchSubProcess(ssub);
			} else if (fe instanceof Gateway) {
				Gateway gateway = (Gateway) fe;
				if (gateway instanceof ExclusiveGateway) {
					neg++;
				} else if (gateway instanceof ParallelGateway) {
					npg++;
				} else if (gateway instanceof InclusiveGateway) {
					nig++;
				} else if (gateway instanceof ComplexGateway) {
					ncg++;
				}
			}
		}
		int sum = neg + npg + nig + ncg;
		long geg = sum > 0 ? (neg / sum) : 0;
		long gpg = sum > 0 ? (npg / sum) : 0;
		long gig = sum > 0 ? (nig / sum) : 0;
		long gcg = sum > 0 ? (ncg / sum) : 0;
		long sum2 = (geg * logOfBase(3, geg)) + (gpg * logOfBase(3, gpg)) + (gig * logOfBase(3, gig))
				+ (gcg * logOfBase(3, gcg));
		if (sum2 > 0.92) {

			this.Suggestion += Messages.getString("MinimizeGatewayHeterogeneity.SuggestionSubprocessKO", l) //$NON-NLS-1$
					+ sub.getName();
			this.status = false;
		}

	}

	public long logOfBase(int base, long num) {
		return (long) (Math.log(num) / Math.log(base));
	}

}
